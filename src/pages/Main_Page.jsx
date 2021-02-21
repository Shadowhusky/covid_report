// Styles
import "./Main_Page.scss";

// Imgs
import main_logo from "../assets/imgs/main_logo.png";

// Utils
import classnames from "classnames";

// Components
import { Menu, Dropdown } from "antd";
import { DownOutlined } from "@ant-design/icons";

const prefix = "main-page-";

function Main_Page() {
  return (
    <section className={`${prefix}container`}>
      <img className={`${prefix}logo`} alt="" src={main_logo}></img>
      <p className={classnames(`${prefix}title`, `${prefix}title-country`)}>
        {" "}
        英国新冠疫情{" "}
      </p>
      <p className={classnames(`${prefix}title`, `${prefix}title-sub`)}> 实时数据 </p>
    </section>
  );
}

export default Main_Page;
