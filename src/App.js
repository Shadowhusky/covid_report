// Pages
import MainPage from "./pages/Main_Page";

// Styles
import "./App.scss";

// Utils
import { useEffect } from "react";

const prefix = "covid-";

let reportWidth = 0.4335078534 * window.innerHeight; // (828 / 1910) * window.innerHeight;

const updateSize = () => {
  reportWidth = 0.4335078534 * window.innerHeight;
  document.documentElement.style.fontSize = reportWidth / 5 + "px";
  document.querySelector(`.${prefix}app`).style.height =
    window.innerHeight + "px";
};

function App() {
  useEffect(() => {
    updateSize();
  });

  window.addEventListener("resize", updateSize);

  return (
    <div className={`${prefix}app`}>
      <MainPage reportWidth={reportWidth} />
    </div>
  );
}

export default App;
