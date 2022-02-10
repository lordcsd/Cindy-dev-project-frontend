export default function Sales({ props }) {
  let today = new Date().toISOString();
  let yesterday = new Date(
    new Date().setDate(new Date().getDate() - 1)
  ).toISOString();
  let lastMonth = new Date(
    new Date().setMonth(new Date().getMonth() - 1)
  ).toISOString();

  let salesToday = () => {
    return props.filter((e) => e.date.split("T")[0] == today.split("T")[0])
      .length;
  };

  let salesYesterday = () => {
    return props.filter((e) => e.date.split("T")[0] == yesterday.split("T")[0])
      .length;
  };

  let salesThisMonth = () => {
    return props.filter((e) => e.date.slice(0, 7) == today.slice(0, 7)).length;
  };
  let salesLastMonth = () => {
    return props.filter((e) => e.date.slice(0, 7) == lastMonth.slice(0, 7))
      .length;
  };

  return (
    <div className="compareValues">
      <div>
        <p className="key">Today</p>
        <p className="value">{salesToday()}</p>
      </div>
      <div>
        <p className="key">Yesterday</p>
        <p className="value">{salesYesterday()}</p>
      </div>
      <div>
        <p className="key">This Month</p>
        <p className="value">{salesThisMonth()}</p>
      </div>
      <div>
        <p className="key">Last Month</p>
        <p className="value">{salesLastMonth()}</p>
      </div>
    </div>
  );
}
