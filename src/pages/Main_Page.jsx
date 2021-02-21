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
    </section>
  );
}

export default Main_Page;
