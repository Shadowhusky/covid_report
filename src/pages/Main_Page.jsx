// Styles
import "./Main_Page.scss";
import "antd/dist/antd.min.css";

// Imgs
import main_logo from "../assets/imgs/main_logo.png";

// Utils
import { useState, useEffect } from "react";
import classnames from "classnames";
import * as htmlToImage from "html-to-image";
import { download } from "../utils/utils";

// Components
import CovidInfo from "../components/CovidInfo";
import { Menu, Dropdown } from "antd";
import { DownOutlined } from "@ant-design/icons";

const prefix = "main-page-";

const currentDate = new Date();

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
  英国: "UK",
  澳大利亚: "Australia",
  美国: "USA",
  加拿大: "Canada",
  新西兰: "New Zealand",
  新加坡: "Singapore",
};

let menu;

const defaultCountry = "英国";
function Main_Page(props) {
  const { reportWidth } = props;
  const [country_selected, selectCountry] = useState("英国");
  const [covid_info, update_covid_info] = useState(covid_info_default);

  const generateReport = () => {
    const node = document.querySelector(".main-page-container");
    node.style.width = reportWidth + "px";
    
    htmlToImage
      .toPng(node, { pixelRatio: 1 })
      .then(function (dataUrl) {
        download(dataUrl, "covid-report");
      })
      .catch(function (error) {
        console.error("oops, something went wrong!", error);
      });
  };

  const updateCovid = (CountryID) => {
    fetch(`https://disease.sh/v3/covid-19/countries/${CountryID}?strict=true`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
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
  };

  useEffect(() => updateCovid(countryIDMap[defaultCountry]), []);

  const updateCountry = (e) => {
    const countryName = e.target.innerText;
    selectCountry(countryName);
    const countryID = countryIDMap[countryName];
    updateCovid(countryID);
  };

  menu = (
    <Menu>
      {Object.keys(countryIDMap).map((contry, i) => {
        return (
          <Menu.Item key={i}>
            <div onClick={updateCountry}>{contry}</div>
          </Menu.Item>
        );
      })}
    </Menu>
  );

  return (
    <section className={`${prefix}container`}>
      <img className={`${prefix}logo`} alt="" src={main_logo}></img>
      <p className={classnames(`${prefix}title`, `${prefix}title-country`)}>
        {" "}
        {country_selected}新冠疫情{" "}
      </p>
      <p className={classnames(`${prefix}title`, `${prefix}title-sub`)}>
        {" "}
        实时数据{" "}
      </p>
      <div
        className={classnames(
          `${prefix}covid-info-container`,
          `${prefix}covid-info-container-data`
        )}
      >
        <div className={`${prefix}covid-info-title`}>
          {`${currentDate.getFullYear()}年${
            currentDate.getMonth() + 1
          }月${currentDate.getDate()}日`}
        </div>
        <p className={`${prefix}covid-today`}>今日新增</p>
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
            title="现有病例"
            type="now"
            count={covid_info.active}
            sum={covid_info.cases}
          />
          <CovidInfo
            title="今日治愈"
            type="cured"
            count={covid_info.todayRecovered}
            sum={covid_info.recovered}
          />
          <CovidInfo
            title="今日死亡"
            type="died"
            count={covid_info.todayDeaths}
            sum={covid_info.deaths}
          />
        </div>
      </div>
      <div
        className={classnames(
          `${prefix}covid-info-container`,
          `${prefix}covid-info-container-graph`
        )}
      >
        <div className={`${prefix}covid-info-title`}>目前增长趋势</div>
      </div>
      <div className={`${prefix}country-selector`}>
        切换国家:
        <Dropdown overlay={menu} trigger={["click"]}>
          <div className="ant-dropdown-link">
            {country_selected} <DownOutlined />
          </div>
        </Dropdown>
      </div>
      <div
        className={`${prefix}generate-report-button`}
        onClick={generateReport}
      >
        生成报告
      </div>
    </section>
  );
}

export default Main_Page;
