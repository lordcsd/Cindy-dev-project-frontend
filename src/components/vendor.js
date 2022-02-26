import { useState, useEffect } from "react";
import axios from "axios";
import { Add, Close } from "@material-ui/icons";

let api, store;

let VendorCard = ({ props, deleteOne, selectCard }) => {
  return (
    <div className="categoryCard">
      <div className="delete">
        <h4>{props.name}</h4>
        <div>
          <button
            className="fillButtonOther"
            onClick={() => selectCard()}
          >
            Edit
          </button>
          <button
            className="outlineButtonOther"
            onClick={() => deleteOne(props._id)}
          >
            Delete
          </button>

        </div>

      </div>
      <div>
        <p>{props.location}</p>
      </div>
    </div>
  );
};

function CreateOrEdit({ props, addNew, updateOne }) {
  let [state, setState] = useState({ _id: "", name: "", location: "" });

  useEffect(() => {
    if (props._id && props.name && props.location) {
      setState({ _id: props._id, name: props.name, location: props.location })
    }
  }, [])

  function handleChange(e) { setState({ ...state, [e.target.name]: e.target.value }) }

  return <div className="createCategory">
    <p>Add New Vendor</p>
    <div className="cateInputs">
      <input
        placeholder="Name"
        value={state.name}
        name="name"
        onChange={(e) => {
          handleChange(e);
        }}
      />
      <textarea
        placeholder="location"
        value={state.location}
        name="location"
        onChange={(e) => {
          handleChange(e);
        }}
      />
      <div className="addCate">
        {
          state._id && state.name && state.location ?
            <button className="fillButtonOther" onClick={() => updateOne(state)}>
              Update
            </button>
            : <button className="fillButtonOther" onClick={() => addNew(state.name, state.location)}>
              Add
            </button>
        }
      </div>
    </div>
  </div>
}

export default function Vendors({ baseURL, showLoginAgain }) {
  let [state, setState] = useState({
    vendors: [],
    name: "",
    location: "",
    createNew: false,
    selected: {}
  });

  let fetchVendors = () => {
    api
      .get(`${baseURL}/vendors/get`)
      .then((res) => {
        setState({ ...state, vendors: res.data.vendors, createNew: false, selected: {} });
      })
      .catch((err) => console.log(err));
  };

  let deleteOne = (_id) => {
    if (window.confirm("Are You Sure You Want to Delete Vendor?")) {
      api
        .delete(`${baseURL}/vendors/delete/${_id}`)
        .then((res) => {
          window.alert("Vendor removed")
          fetchVendors();
        })
        .catch((err) => {
          checkAuth(err)
        });
    }
  };

  async function checkAuth(err) {
    if (err.message.includes("401")) {
      showLoginAgain();
    } if (err.message.includes("422")) {
      alert("Record already exists")
    }
  }

  async function selectCard(index) {
    await setState({ ...state, selected: state.vendors[index], createNew: true })
  }

  let updateOne = (params) => {
    if (window.confirm("Are you sure you want to update this record?")) {
      api.patch(`${baseURL}/vendors/edit`, params)
        .then((res) => {
          window.alert("Vendor Updated");
          fetchVendors();
        })
        .catch((err) => {
          checkAuth(err)
        });
    }
  }

  let addNew = (name, location) => {
    let data = { name, location };
    api
      .post(`${baseURL}/vendors/create`, data)
      .then((res) => {
        window.alert("Vendor Added");
        fetchVendors();
      })
      .catch((err) => {
        if (err.message.includes("401")) {
          showLoginAgain();
        }
      });
  };

  useState(() => {
    const ac = new AbortController();
    store = JSON.parse(window.localStorage.getItem("teenahStores"));
    if (store) {
      api = axios.create({
        url: baseURL,
        headers: { Authorization: `Bearer ${store.token}` },
      });
      fetchVendors();
    } else {
      api = axios.create({ url: baseURL });
      fetchVendors();
    }
    return () => ac.abort();
  }, []);

  return (
    <div className="categories">
      <h4>Manage Vendors</h4>
      <div className="categoriesHead"></div>
      <div className="categoriesCardContain">
        {!state.createNew ? state.vendors.map((each, index) => (
          <VendorCard props={each} key={index} deleteOne={deleteOne} selectCard={() => selectCard(index)} />
        )) : <CreateOrEdit props={state.selected} addNew={addNew} updateOne={updateOne} />}
      </div>

      <div className="addNew"
        onClick={() => {
          state.createNew ?
            setState({ ...state, createNew: false, selected: {} })
            : setState({ ...state, createNew: true })
        }}>
        {state.createNew ? <Close /> : <Add />}
      </div>
    </div>
  );
}
