// Styles
import "./Main_Page.scss";
import "antd/dist/antd.min.css";

// Imgs
import main_logo from "../assets/imgs/main_logo.png";
import qrcode from "../assets/imgs/qrcode.png";

// Utils
import { useState, useEffect, useRef } from "react";
import classnames from "classnames";
import html2canvas from "html2canvas";
import * as htmlToImage from "html-to-image";
import { svgToPng } from "../utils/utils";

// Components
import CovidInfo from "../components/CovidInfo";
import { Menu, Dropdown, Spin } from "antd";
import { DownOutlined } from "@ant-design/icons";
import Chart from "react-apexcharts";

// I18n
import lang_ from "../i18n/i18n.jsx";

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
  const lang = lang_[currentLang];
  const { reportWidth } = props;
  const reportRef = useRef(null);
  const [country_selected, selectCountry] = useState("UK");
  const [covid_info, update_covid_info] = useState(covid_info_default);
  const [chartOptions, update_chart_options] = useState(null);
  const [is_report, set_report_state] = useState(false);
  const [reportVisible, setReportVisibility] = useState(false);

  const generateReport = () => {
    const node = document.querySelector(`.${prefix}container`);
    node.style.width = reportWidth + "px";

    // Hide button and country selector, show About us
    setReportVisibility(true);

    setTimeout(() => {
      set_report_state(true);
      html2canvas(node, {
        height: window.innerHeight - 2,
        width: reportWidth - 2,
        windowHeight: 1000,
        ignoreElements: (node_) => {
          return node_.getAttribute
            ? node_?.getAttribute("hideInReport") === "true"
            : true;
        },
      })
        .then(function (canvas) {
          reportRef.current.src = canvas.toDataURL("image/jpeg");
          reportRef.current.setAttribute("state", "loaded");
          set_report_state(false);
        })
        .catch(function (error) {
          console.error("oops, something went wrong!", error);
          setReportVisibility(false);
        });
    }, 500);
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
        const { cases } = data.timeline;
        update_chart_options({
          options: {
            legend: {
              show: false,
            },
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
            yaxis: {
              tickAmount: 4,
              labels: {
                maxWidth: window.innerWidth > 500 ? undefined : 32 ,
                show: true,
                align: "center",
                style: {
                  cssClass: "apexcharts-yaxis-label",
                },
                formatter: (value) => {
                  value = parseFloat(value);
                  if (value > 9999) {
                    value = value.toExponential(1);
                  }
                  return value;
                },
              },
            },
            xaxis: {
              categories: Object.keys(cases),
              tickAmount: 5,
              labels: {
                rotate: 0,
                style: {
                  fontSize: "0.11rem",
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
              {lang[contry]}
            </div>
          </Menu.Item>
        );
      })}
    </Menu>
  );

  return (
    <div>
      <div
        className={`${prefix}report-mask`}
        style={{ visibility: reportVisible ? "visible" : "hidden" }}
      />
      <section
        className={classnames(
          `${prefix}report-container`,
          reportVisible && `${prefix}report-show-animated`
        )}
      >
        <Spin size="large" tip="generating..." />
        <img ref={reportRef} alt="" pagespeed_no_transform />
        <p>长按图片保存/分享报告</p>
        <span
          onClick={() => {
            reportRef.current.setAttribute("state", "");
            set_report_state(false);
            setReportVisibility(false);
          }}
        >
          {lang["cancel"]}
        </span>
      </section>
      <section
        className={`${prefix}container`}
        style={{ filter: reportVisible ? "blur(10px)" : "" }}
      >
        <span className={`${prefix}logo`}>- 留学与海 -</span>
        {/* <img className={`${prefix}logo`} alt="" src={main_logo}></img> */}
        <p className={classnames(`${prefix}title`, `${prefix}title-country`)}>
          {lang[country_selected]}
          {currentLang !== "zh_CN" && " "}
          {lang["covid"]}
        </p>
        <p className={classnames(`${prefix}title`, `${prefix}title-sub`)}>
          {lang["realTimeData"]}
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
          <p className={`${prefix}covid-today`}>{lang["new"]}</p>
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
              title={lang["current"]}
              type="current"
              count={covid_info.active}
              sum={covid_info.cases}
              subtitle={lang["total"]}
            />
            <CovidInfo
              title={lang["curedToday"]}
              type="cured"
              count={covid_info.todayRecovered}
              sum={covid_info.recovered}
              subtitle={lang["total"]}
            />
            <CovidInfo
              title={lang["diedToday"]}
              type="died"
              count={covid_info.todayDeaths}
              sum={covid_info.deaths}
              subtitle={lang["total"]}
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
            {lang["growthTrend"]}
          </div>
          {chartOptions ? (
            <Chart
              options={chartOptions.options}
              series={chartOptions.series}
              type="line"
              height="70%"
              width="88%"
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
          style={{ display: is_report ? "block" : "none" }}
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
          {lang["tips"]}
        </p>
        <div hideInReport={"true"} className={`${prefix}country-selector`}>
          {lang["switchCountry"]}
          <Dropdown overlay={menu} trigger={["click"]}>
            <div className="ant-dropdown-link">
              {lang[country_selected]} <DownOutlined />
            </div>
          </Dropdown>
        </div>
        <div
          hideInReport={"true"}
          className={`${prefix}generate-report-button`}
          onClick={generateReport}
        >
          {lang["generateReport"]}
        </div>
      </section>
    </div>
  );
}

export default Main_Page;
