// Styles
import "./CovidInfo.scss";

const prefix = "covidinfo-";

const colorMap = {
  died: "#525252",
  cured: "#37C756",
  current: "#FA7C7C",
};

function CovidInfo(props) {
  const { title, count, sum, type, subtitle } = props;

  return (
    <div className={`${prefix}container`}>
      <p>{title}</p>
      <p style={{ color: colorMap[type] }}>
        {type !== "current" && "+"}
        {count.toLocaleString()}
      </p>
      <p>{subtitle} {sum.toLocaleString()}</p>
    </div>
  );
}

export default CovidInfo;
