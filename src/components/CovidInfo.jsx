// Styles
import "./CovidInfo.scss";

const prefix = "covidinfo-";

const colorMap = {
  died: "#525252",
  cured: "#37C756",
  now: "#FA7C7C",
};

function CovidInfo(props) {
  const { title, count, sum, type } = props;

  return (
    <div className={`${prefix}container`}>
      <p>{title}</p>
      <p style={{ color: colorMap[type] }}>+{count.toLocaleString()}</p>
      <p>累计 {sum.toLocaleString()}</p>
    </div>
  );
}

export default CovidInfo;
