// Pages
import MainPage from "./pages/Main_Page";

// Styles
import "./App.scss";

// Utils
import { useEffect } from "react";

const prefix = "covid-";

const updateSize = () => {
  document.documentElement.style.fontSize =
  ((414 / 896) * window.innerHeight) / 5 + "px";
};

function App() {
  useEffect(() => {
    updateSize()
  });

  window.onresize = updateSize;

  return (
    <div className={`${prefix}app`}>
      <MainPage />
    </div>
  );
}

export default App;
