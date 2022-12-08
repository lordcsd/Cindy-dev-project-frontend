import { useEffect, useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { configConstants } from "../common/constants";


const {SERVER_ROOT_URL: baseURL} = configConstants
let api;


export default function Login() {
  let [state, setState] = useState({
    name: "",
    password: "",
    loading: false,
  });

  let history = useHistory();

  let handleInput = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  let login = (e) => {
    e.preventDefault();
    if (state.name.length > 0 && state.password.length > 0) {
      setState({ ...state, loading: true });
      let data = { name: state.name, password: state.password };
      api
        .post(`${baseURL}/admins/login`, data)
        .then((res) => {
          window.localStorage.setItem(
            "teenahStores",
            JSON.stringify(res.data)
          );
          history.push("/dashboard");
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      window.alert("Please Enter Matching Credentials");
    }
  };

  useEffect(() => {
    let store = JSON.parse(window.localStorage.getItem("teenahStores"));
    api = axios.create({
      url: baseURL,
      headers: { Authorization: store ? `Bearer ${store.token}` : "unKnown" },
    });
    api
      .get(baseURL + "/users")
      .then((res) => {
        history.push("/dashboard");
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  return (
    <div className="loginRoot">
      <div
        className="loading"
        style={{ display: state.loading ? "block" : "none" }}
      ></div>

      <form className="login" onSubmit={login}>
        <div>
          <div className="flexRow">
            <div className="logoDiv"></div>
            <p>xpress meal</p>
          </div>
          <label>Name:</label>
          <input name="name" onChange={(e) => handleInput(e)} />
          <label>Password:</label>{" "}
          <input name="password" onChange={handleInput} type="password" />
        </div>
        <span className="loginButtons">
          <button className="saveButton">Login</button>
        </span>
      </form>
    </div>
  );
}
