// Pages
import MainPage from "./pages/Main_Page";

// Styles
import "./App.scss";

const prefix = "covid-"

function App() {
  return (
    <div className={`${prefix}app`}>
      <MainPage />
    </div>
  );
}

export default App;
