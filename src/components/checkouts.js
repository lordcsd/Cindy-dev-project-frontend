import { CheckBox, Close, RemoveRedEyeOutlined } from "@material-ui/icons";
import { useEffect, useState } from "react";
import axios from "axios";

let api, store;

let EachCard = ({ props, baseURL, select }) => {
  let [showProducts, setShowProducts] = useState(false)

  let markAsDelivered = () => {
    api
      .patch(`${baseURL}/checkOut/setDelivered/${props._id}`)
      .then((res) => {
        alert(res.data.message);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  console.log(props)

  return <div className="deliveryCard" onClick={select}>
    <p>{props.userName}</p>
    <div className="deliveryCardProducts">
      <RemoveRedEyeOutlined className="icon" onClick={() => setShowProducts(!showProducts)} />
      {
        showProducts ?
          props.products.map((each, index) =>
            <div className="line" key={index}>
              <p className="productName">{each.productTitle}</p>
              <p>Price: {each.price}</p>
              <p>Unit: {each.count}</p>
            </div>
          )

          : (<p>{props.products.length} Products  </p>)
      }

    </div>

    {props.date.includes("T") ? (
      <div>
        <p>{props.date.split("T")[1].split(".")[0]}</p>
        <p>{props.date.split("T")[0]}</p>
      </div>
    ) : (
      <div></div>
    )}

    {props["paid"] ? <p>{props.paid.total}</p> : <p></p>}
    {props.address ? <p>{props.address.address}</p> : <p></p>}
    <div className="status">
      <p>{props.delivered ? "Delivered" : "Not Delivered"}</p>
      {props.delivered ? <CheckBox /> : <Close onClick={markAsDelivered} />}
    </div>
  </div>

};

export default function Deliveries({ baseURL }) {
  let [deliveries, setDeliveries] = useState([]);
  let [oneSelected, setOneSelected] = useState(null)

  let fetchCheckOuts = () => {
    api
      .get(baseURL + "/checkOut")
      .then((res) => {
        setDeliveries(res.data.checkOuts);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    const ac = new AbortController();
    store = JSON.parse(window.localStorage.getItem("teenahStores"));
    if (store) {
      api = axios.create({
        url: baseURL,
        headers: { Authorization: `Bearer ${store.token}` },
      });
      fetchCheckOuts();
    }
    return () => ac.abort();
  }, []);
  return (
    <div className="deliveryRoot">
      <h4>Manage Deliveries</h4>

      <div className="deliveryCardsContain">
        <div className="deliveryCardsHeader">
          <p>UserName</p>
          <p>Products</p>
          <p>Time</p>
          <p>Paid</p>
          <p>Address</p>
          <p>Status</p>
        </div>
        <div className="deliveryCards">
          {deliveries.map((each, index) =>
            <EachCard
              select={() => setOneSelected(each)}
              props={each}
              key={index}
              baseURL={baseURL}
              fetchCheckOuts={fetchCheckOuts}
            />

          )}
        </div>
      </div>
    </div>
  );
}
