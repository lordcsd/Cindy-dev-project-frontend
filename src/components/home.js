import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Products from "./products";
import Deliveries from "./checkouts";
import Users from "./users";
import Categories from "./categories";
import Location from "./location";
import HeaderLogo from "../images/headerLogo.svg";

import Aside from "./aside";

import {
  GraphicEq,
  ShoppingCart,
  ViewAgenda,
  VerifiedUserSharp,
  CategorySharp,
  LocationCity,
  EmojiTransportationSharp,
} from "@material-ui/icons";
import Overview from "./overview";
import DeliveryFees from "./deliveryFees";

//let baseURL = "http://localhost:4000";
let baseURL = "https://xpress-meal-backend.herokuapp.com";
let api, store;

function Home() {
  let [state, setState] = useState({
    selected: 0,
    showOptions: false,
  });

  let history = useHistory();

  let showLoginAgain = () => {
    alert("Login Session Has Expired");
    history.push("/");
  };

  let selected = [
    <Overview baseURL={baseURL} showLoginAgain={showLoginAgain} key={0} />,
    <Products baseURL={baseURL} showLoginAgain={showLoginAgain} key={1} />,
    <Deliveries baseURL={baseURL} showLoginAgain={showLoginAgain} key={2} />,
    <Users baseURL={baseURL} showLoginAgain={showLoginAgain} key={3} />,
    <Categories baseURL={baseURL} showLoginAgain={showLoginAgain} key={4} />,
    <Location baseURL={baseURL} showLoginAgain={showLoginAgain} key={5} />,
    <DeliveryFees baseURL={baseURL} showLoginAgain={showLoginAgain} key={6} />,
  ];

  let switchSelected = (which) => {
    setState({ ...state, selected: which, showOptions: false });
  };

  let logout = () => {
    if (window.confirm("Are You Sure You Want To Log-out?")) {
      window.localStorage.removeItem("teenahStores");
      history.push("/");
    }
  };

  useEffect(() => {
    const ac = new AbortController();
    store = JSON.parse(window.localStorage.getItem("teenahStores"));
    return () => ac.abort();
  }, []);

  let asideMethods = [
    {
      title: "Overview",
      method: () => {
        switchSelected(0);
      },
      icon: () => <GraphicEq />,
    },
    {
      title: "Products",
      method: () => {
        switchSelected(1);
      },
      icon: () => <ViewAgenda />,
    },
    {
      title: "Check-Outs",
      method: () => {
        switchSelected(2);
      },
      icon: () => <ShoppingCart />,
    },
    {
      title: "Users",
      method: () => {
        switchSelected(3);
      },
      icon: () => <VerifiedUserSharp />,
    },
    {
      title: "Categories",
      method: () => {
        switchSelected(4);
      },
      icon: () => <CategorySharp />,
    },
    {
      title: "Location",
      method: () => {
        switchSelected(5);
      },
      icon: () => <LocationCity />,
    },
    {
      title: "Delivery Fees",
      method: () => {
        switchSelected(6);
      },
      icon: () => <EmojiTransportationSharp />,
    },
  ];

  return (
    <div className="root">
      <Aside methods={asideMethods} selected={state.selected} />
      <div className="main">
        <header>
          <div className="mainHeader">
            <img
              src={HeaderLogo}
              style={{ height: "2.5rem", padding: "10px 0" }}
            />
            <div>
              <button
                className="outlineButtonWhite"
                style={{ width: "45%" }}
                onClick={() => logout()}
              >
                Logout
              </button>
              <div
                className="customList"
                onClick={() =>
                  setState({ ...state, showOptions: !state.showOptions })
                }
              >
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          </div>
        </header>
        {state.showOptions && (
          <div className="optionsList">
            {asideMethods.map((each, index) => {
              return (
                <div className="each" onClick={each.method} key={index}>
                  <div>
                    {each.icon()} <p>{each.title}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {state.showOptions && (
          <div
            className="drawer"
            style={{
              display: window.innerWidth > 499 ? "none" : "block",
              transition: "1s ease-in",
            }}
          >
            {asideMethods.map((each, index) => {
              return (
                <div className="each" onClick={each.method} key={index}>
                  {each.icon()}
                  <p>{each.title}</p>
                </div>
              );
            })}
          </div>
        )}
        <div
          className="mainHomeDisplay"
          onClick={() =>
            window.innerWidth <= 500
              ? setState({ ...state, showOptions: false })
              : null
          }
        >
          {selected[state.selected]}
        </div>
      </div>
    </div>
  );
}

export default Home;
