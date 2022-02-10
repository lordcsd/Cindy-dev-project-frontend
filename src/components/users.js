import { SearchOutlined } from "@material-ui/icons";
import axios from "axios";
import { useEffect, useState } from "react";

let api, store;

let UserCard = ({ props }) => {
  return (
    <div className="userCard">
      <p>{props.name}</p>
      <p>{props._id}</p>
      <p>{props.email}</p>
      <p>{props.phone}</p>
    </div>
  );
};

export default function Users({ baseURL, showLoginAgain }) {
  let [state, setState] = useState({
    users: [],
    searchResult: [],
    searchKey: "name",
    searchInput: "",
  });

  let fetchUsers = () => {
    api
      .get(`${baseURL}/users`)
      .then((res) => {
        setState({ ...state, users: res.data.users });
      })
      .catch((err) => {
        if (err.message.includes("401")) {
          showLoginAgain();
        }
      });
  };

  useEffect(() => {
    const ac = new AbortController();
    store = JSON.parse(window.localStorage.getItem("teenahStores"));
    if (store) {
      api = axios.create({
        url: `${baseURL}/users`,
        headers: { Authorization: `Bearer ${store.token}` },
      });
      fetchUsers();
    }
    return () => ac.abort();
  }, []);

  let searchKeys = ["name", "_id", "email", "age", "phone"];

  let setSearchKey = (e) => {
    setState({ ...state, setSearchKey: searchKeys[Number(e.target.value)] });
  };

  let searchArray = (phrase) => {
    return state.users.filter((e) =>
      e[state.searchKey].toUpperCase().includes(phrase.toUpperCase())
    );
  };

  let mapped = () =>
    state.searchResult.length > 0 ? state.searchResult : state.users;

  return (
    <div className="usersRoot">
      <h4>View Users</h4>
      <div className="searchBar">
        <select onChange={(e) => setSearchKey(e)}>
          {searchKeys.map((each, index) => {
            return (
              <option value={index} key={index}>
                {each}
              </option>
            );
          })}
        </select>
        <div>
          <input
            value={state.searchInput}
            className="input"
            placeholder="Search User"
            onChange={(e) => {
              setState({
                ...state,
                searchInput: e.target.value,
                searchResult: searchArray(e.target.value),
              });
            }}
          />
          <SearchOutlined />
        </div>
      </div>

      <div className="userCardsContain">
        <div className="usersHeader">
          <p>Name</p>
          <p>_id</p>
          <p>Email</p>
          <p>Phone</p>
        </div>
        {mapped().map((each, index) => {
          return <UserCard props={each} key={index} />;
        })}
      </div>
    </div>
  );
}
