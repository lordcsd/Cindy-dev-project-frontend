import GoogleApiWrapper from "./locationComponents/googleMap";
import axios from "axios";
import { useEffect, useState } from "react";

let store, api;

export default function Location({ baseURL }) {
  let [state, setState] = useState({
    editAddress: false,
    addressExist: false,
    address: "",
    lat: 0,
    lng: 0,
    _id: ""
  });

  let getAddressValues = (values) => {
    setState({
      ...state,
      address: values.address,
      lat: values.lat,
      lng: values.lng,
    });
  };

  let saveAddress = () => {
    if (
      state.address.length > 0 &&
      state.lat != 0 &&
      state.lng != 0 &&
      !state.addressExist
    ) {
      api
        .post(baseURL + "/adminLocation", {
          address: state.address,
          lng: state.lng,
          lat: state.lat,
        })
        .then((res) => {
          setState({ ...state, addressExist: true, editAddress: false });
        })
        .catch((err) => {
          alert(err);
        });
    }
  };

  let updateAddress = () => {
    if (
      state.address.length > 0 &&
      state.lat != 0 &&
      state.lng != 0 &&
      state.addressExist
    ) {
      console.log({
        _id: state._id,
        address: state.address,
        lng: state.lng,
        lat: state.lat,
      })
      api
        .patch(baseURL + "/adminLocation", {
          _id: state._id,
          address: state.address,
          lng: state.lng,
          lat: state.lat,
        })
        .then((res) => {

          setState({ ...state, editAddress: false });
        })
        .catch((err) => {
          alert(err);
        });
    }
  };

  useEffect(() => {
    const ac = new AbortController();
    store = JSON.parse(window.localStorage.getItem("teenahStores"));
    if (store) {
      api = axios.create({
        headers: { Authorization: `Bearer ${store.token}` },
      });
      api
        .get(baseURL + "/adminLocation")
        .then((res) => {
          let fetched = res.data.response[0];
          setState({
            ...state,
            address: fetched.address,
            _id: fetched._id,
            lat: fetched.lat,
            lng: fetched.lng,
            addressExist: true,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }

    return () => ac.abort();
  }, []);

  return (
    <div>
      {!state.editAddress ? (
        <div className="presentDateContain">
          <div className="presentDate">
            <h2>Present Location</h2>
            <h3>
              {state.address.length > 0 ? state.address : "No Address Yet"}
            </h3>
            <div>
              <button
                className="fillButtonOther"
                onClick={() => {
                  setState({ ...state, editAddress: true });
                }}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <GoogleApiWrapper
            saveAddress={state.addressExist ? updateAddress : saveAddress}
            old={state.addressExist}
            location={{ lat: state.lat, lng: state.lng }}
            getAddressValues={getAddressValues}
          />
        </div>
      )}
    </div>
  );
}
