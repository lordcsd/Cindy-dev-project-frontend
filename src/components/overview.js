import { CalendarToday, Person, Send, ViewAgenda } from "@material-ui/icons";
import axios from "axios";
import React, { useEffect, useState } from "react";
//import { Chart } from "react-charts";
import Sales from "./overviewComponents/sales";

let OverviewSticker = ({ props }) => {
  return (
    <div className="overviewSticker">
      <div>
        <p className="title">{props.title}</p>
        <p className="value">{props.value}</p>
      </div>
      {props.icon()}
    </div>
  );
};

export default function Overview({ baseURL }) {
  let [details, setDetails] = useState({
    sales: [],
    products: [],
    users: [],
  });

  useEffect(() => {
    axios({
      method: "GET",
      url: baseURL + "/overview",
    })
      .then((res) => {
        setDetails(res.data);
      })
      .catch();
  }, []);

  let stickers = [
    {
      title: "Sales",
      value: details.sales.length,
      icon: () => <CalendarToday />,
    },
    {
      title: "Users",
      value: details.users.length,
      icon: () => <Person />,
    },
    {
      title: "Products",
      value: details.products.length,
      icon: () => <ViewAgenda />,
    },
    {
      title: "Orders Delivered",
      value: details.sales.filter((e) => e.delivered == true).length,
      icon: () => <Send />,
    },
  ];
  return (
    <div className="overviewRoot">
      <h4>Overview</h4>

      <div className="overviewStickers">
        {stickers.map((each, index) => (
          <div>
            <OverviewSticker props={each} key={index} />
          </div>
        ))}
      </div>

      <Sales props={details.sales} />

      {/* <div className="chartCardContain">
        <div className="chartCard">
          <MyChart1 />
          <div className="right">
            <p>Sales Overview</p>
          </div>
        </div>

        <div className="chartCard">
          <MyChart2 />
          <div className="right">
            <p>Users</p>
          </div>
        </div>
      </div> */}
    </div>
  );
}
