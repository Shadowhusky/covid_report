// Styles
import "./Main_Page.scss";

// Imgs
import main_logo from "../assets/imgs/main_logo.png";

// Utils
import { useState } from "react";
import classnames from "classnames";

// Components
import CovidInfo from "../components/CovidInfo";
import { Menu, Dropdown } from "antd";
import { DownOutlined } from "@ant-design/icons";

const prefix = "main-page-";

const currentDate = new Date();

const covid_info_default = {
  new: 1000,
};

function Main_Page() {
  const [country_selected, selectCountry] = useState("英国");
  const [covid_info, update_covid_info] = useState(covid_info_default);
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
      <div className={`${prefix}covid-info-container`}>
        <div className={`${prefix}date-container`}>
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
          <CovidInfo title="现有病例" type="now" count={1000} sum={1000} />
          <CovidInfo title="今日治愈" type="cured" count={1000} sum={1000} />
          <CovidInfo title="今日死亡" type="died" count={1000} sum={1000} />
        </div>
      </div>
    </section>
  );
}

export default Main_Page;
