export default function Aside({ methods, selected }) {
  return (
    <aside className="asideMain">
      <div className="blank"></div>
      {methods.map((each, index) => {
        return (
          <div
            key={index}
            className={index != selected ? "eachButton" : "eachButtonSelected"}
            onClick={each.method}
          >
            {each.icon()}
            <p>{each.title}</p>
          </div>
        );
      })}
    </aside>
  );
}
