// Styles
import "./Main_Page.scss";
import "antd/dist/antd.min.css";

// Imgs
import main_logo from "../assets/imgs/main_logo.png";
import qrcode from "../assets/imgs/qrcode.png";

// Utils
import { useState, useEffect } from "react";
import classnames from "classnames";
import * as htmlToImage from "html-to-image";
import { download } from "../utils/utils";

// Components
import CovidInfo from "../components/CovidInfo";
import { Menu, Dropdown, Spin } from "antd";
import { DownOutlined } from "@ant-design/icons";
import Chart from "react-apexcharts";

// I18n
import lang from "../i18n/i18n.jsx";

const prefix = "main-page-";

const currentDate = new Date();

const defaultLang = "zh_CN";

const monthMap = {
  0: "Jan",
  1: "Feb",
  2: "Mar",
  3: "Apr",
  4: "May",
  5: "Jun",
  6: "Jul",
  7: "Aug",
  8: "Sep",
  9: "Oct",
  10: "Nov",
  11: "Dec",
};

const covid_info_default = {
  cases: 0,
  active: 0,
  new: 0,
  todayDeaths: 0,
  todayRecovered: 0,
  deaths: 0,
  recovered: 0,
};

const countryIDMap = {
  UK: "UK",
  Australia: "Australia",
  USA: "USA",
  Canada: "Canada",
  NewZealand: "New Zealand",
  Singapore: "Singapore",
};

let menu;

const defaultCountry = "UK";

function Main_Page(props) {
  const currentLang = window.g_config?.lang
    ? window.g_config.lang
    : defaultLang;
  const { reportWidth } = props;
  const [country_selected, selectCountry] = useState("UK");
  const [covid_info, update_covid_info] = useState(covid_info_default);
  const [chartOptions, update_chart_options] = useState(null);
  const [is_report, set_report_state] = useState(false);

  const generateReport = () => {
    const node = document.querySelector(".main-page-container");
    node.style.width = reportWidth + "px";

    // Hide button and country selector, show About us
    set_report_state(true);

    htmlToImage
      .toPng(node, { pixelRatio: 1 })
      .then(function (dataUrl) {
        download(dataUrl, "covid-report");
      })
      .catch(function (error) {
        console.error("oops, something went wrong!", error);
      })
      .finally(() => {
        set_report_state(false);
      });
  };

  const updateCovid = (CountryID) => {
    update_chart_options(null);
    fetch(`https://disease.sh/v3/covid-19/countries/${CountryID}?strict=true`)
      .then((res) => res.json())
      .then((data) => {
        update_covid_info({
          cases: data.cases,
          active: data.active,
          new: data.todayCases,
          todayDeaths: data.todayDeaths,
          todayRecovered: data.todayRecovered,
          deaths: data.deaths,
          recovered: data.recovered,
        });
      });
    fetch(`https://disease.sh/v3/covid-19/historical/${CountryID}?lastdays=90`)
      .then((res) => res.json())
      .then((data) => {
        const cases = data.timeline.cases;
        update_chart_options({
          options: {
            chart: {
              animations: {
                enabled: false,
              },
              id: "Linear chart",
              toolbar: {
                show: false,
              },
              selection: {
                enabled: false,
              },
              zoom: {
                enabled: false,
              },
            },
            stroke: {
              width: 3,
            },
            xaxis: {
              categories: Object.keys(cases),
              tickAmount: 6,
              labels: {
                rotate: 0,
                style: {
                  fontSize: "0.09rem",
                },
              },
            },
          },
          series: [
            {
              name: "cases",
              data: Object.values(cases),
            },
          ],
        });
      });
  };

  useEffect(() => updateCovid(countryIDMap[defaultCountry]), []);

  const updateCountry = (e) => {
    const countryName = e.target.getAttribute("country");
    selectCountry(countryName);
    const countryID = countryIDMap[countryName];
    updateCovid(countryID);
  };

  menu = (
    <Menu>
      {Object.keys(countryIDMap).map((contry, i) => {
        return (
          <Menu.Item key={i}>
            <div onClick={updateCountry} country={contry}>
              {lang[currentLang][contry]}
            </div>
          </Menu.Item>
        );
      })}
    </Menu>
  );

  return (
    <section className={`${prefix}container`}>
      <img className={`${prefix}logo`} alt="" src={main_logo}></img>
      <p className={classnames(`${prefix}title`, `${prefix}title-country`)}>
        {lang[currentLang][country_selected]}
        {currentLang !== "zh_CN" && " "}
        {lang[currentLang]["covid"]}
      </p>
      <p className={classnames(`${prefix}title`, `${prefix}title-sub`)}>
        {lang[currentLang]["realTimeData"]}
      </p>
      <div
        className={classnames(
          `${prefix}covid-info-container`,
          `${prefix}covid-info-container-data`
        )}
      >
        <div className={`${prefix}covid-info-title`}>
          {currentLang === "zh_CN"
            ? `${currentDate.getFullYear()}年${
                currentDate.getMonth() + 1
              }月${currentDate.getDate()}日`
            : `${currentDate.getDate()} ${
                monthMap[currentDate.getMonth()]
              } ${currentDate.getFullYear()}`}
        </div>
        <p className={`${prefix}covid-today`}>{lang[currentLang]["new"]}</p>
        <p
          className={classnames(
            `${prefix}covid-today`,
            `${prefix}covid-today-count`
          )}
        >
          +{covid_info["new"].toLocaleString()}
        </p>
        <div className={`${prefix}covid-multi-container`}>
          <CovidInfo
            title={lang[currentLang]["current"]}
            type="current"
            count={covid_info.active}
            sum={covid_info.cases}
            subtitle={lang[currentLang]["total"]}
          />
          <CovidInfo
            title={lang[currentLang]["curedToday"]}
            type="cured"
            count={covid_info.todayRecovered}
            sum={covid_info.recovered}
            subtitle={lang[currentLang]["total"]}
          />
          <CovidInfo
            title={lang[currentLang]["diedToday"]}
            type="died"
            count={covid_info.todayDeaths}
            sum={covid_info.deaths}
            subtitle={lang[currentLang]["total"]}
          />
        </div>
      </div>
      <div
        className={classnames(
          `${prefix}covid-info-container`,
          `${prefix}covid-info-container-graph`
        )}
      >
        <div className={`${prefix}covid-info-title`}>
          {lang[currentLang]["growthTrend"]}
        </div>
        {chartOptions ? (
          <Chart
            options={chartOptions.options}
            series={chartOptions.series}
            type="line"
            height="70%"
            width="98%"
            className={`${prefix}covid-trending-chart`}
          />
        ) : (
          <Spin tip="Loading..." />
        )}
      </div>
      <div
        className={classnames(
          `${prefix}covid-info-container`,
          `${prefix}covid-info-container-aboutus`
        )}
        style={{ visibility: is_report ? "visible" : "hidden" }}
      >
        <div className={`${prefix}covid-info-title-left`}>关于我们</div>
        <section>
          <p>- 打造面向留学生的 SaaS</p>
          <p>- 交友 二手 房屋</p>
          <p>- 高端社交平台</p>
        </section>
        <img src={qrcode} alt="" />
      </div>
      <p
        className={`${prefix}covid-aboutus-tips`}
        style={{ visibility: is_report ? "visible" : "hidden" }}
      >
        {lang[currentLang]["tips"]}
      </p>
      <div
        className={`${prefix}country-selector`}
        style={{ visibility: !is_report ? "visible" : "hidden" }}
      >
        {lang[currentLang]["switchCountry"]}
        <Dropdown overlay={menu} trigger={["click"]}>
          <div className="ant-dropdown-link">
            {lang[currentLang][country_selected]} <DownOutlined />
          </div>
        </Dropdown>
      </div>
      <div
        className={`${prefix}generate-report-button`}
        onClick={generateReport}
        style={{ visibility: !is_report ? "visible" : "hidden" }}
      >
        {lang[currentLang]["generateReport"]}
      </div>
    </section>
  );
}

export default Main_Page;
