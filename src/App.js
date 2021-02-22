// Pages
import MainPage from "./pages/Main_Page";

// Styles
import "./App.scss";

// Utils
import { useEffect } from "react";

const prefix = "covid-";

const reportWidth = (828 / 1910) * window.innerHeight;

const updateSize = () => {
  document.documentElement.style.fontSize = reportWidth / 5 + "px";
};

function App() {
  useEffect(() => {
    updateSize();
  });

  window.onresize = updateSize;

  return (
    <div className={`${prefix}app`}>
      <MainPage reportWidth={reportWidth} />
    </div>
  );
}

export default App;
