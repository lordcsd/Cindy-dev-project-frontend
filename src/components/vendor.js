import { useState, useEffect } from "react";
import axios from "axios";
import { Add, Close } from "@material-ui/icons";

let api, store;

let VendorCard = ({ props, deleteOne, selectCard }) => {
  return (
    <div className="categoryCard">
      <div className="delete">
        <div>
          <h4>{props.name}</h4>
          <p><b>Location: </b>{props.location}</p>
          <p><b>Reservations: </b>{props.reservations}</p>
        </div>
        <div>
          <button
            className="fillButtonOther"
            onClick={selectCard}
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

    </div>
  );
};

function CreateOrEdit({ props, addNew, updateOne }) {
  let [state, setState] = useState({
    _id: "",
    name: "",
    location: "",
    reservations: 0
  });

  const { _id, name, location, reservations } = props

  useEffect(() => {
    if (_id && name && location) {
      setState({ _id, name, location, reservations });
    }
  }, [])

  function handleChange(e) { setState({ ...state, [e.target.name]: e.target.value }) }

  const vendorInputs = [
    {
      label: 'Name',
      placeholder: 'Name',
      value: state.name,
      name: 'name'
    },
    {
      label: 'Location',
      placeholder: 'Location',
      value: state.location,
      name: 'location'
    },
    {
      label: 'Reservation',
      placeholder: 'Reservation',
      value: state.reservations,
      name: 'reservations'
    },
  ]

  return <div className="createCategory">
    <p>Add New Vendor</p>
    <div className="cateInputs">

      {
        vendorInputs
          .map((field, key) => {
            const { label, placeholder, value, name } = field
            return <div key={key}>
              <label>{label}</label>
              <input
                placeholder={placeholder}
                value={value}
                name={name}
                onChange={handleChange}
              />
            </div>
          })
      }

      <div className="addCate">
        {
          state._id && state.name && state.location ?
            <button className="fillButtonOther" onClick={() => updateOne(state)}>
              Update
            </button>
            : <button className="fillButtonOther" onClick={() => addNew(state.name, state.location, state.reservations)}>
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
      .catch((err) => checkAuth(err));
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
    }

    if (err.message.includes("422")) {
      console.log(err.message)
      alert("Invalid Input, fill all fields");
    }

    if (err.message.includes("50")) {
      alert("Server Error");
    }
  }

  async function selectCard(index) {
    await setState({ ...state, selected: state.vendors[index], createNew: true })
  }

  let updateOne = (params) => {
    if (params.reservations) {
      params.reservations = parseInt(params.reservations);
    }
    console.log("params: ", params)
    if (window.confirm("Are you sure you want to update this record?")) {
      api.patch(`${baseURL}/vendors/edit`, params)
        .then((res) => {
          window.alert("Vendor Updated");
          fetchVendors();
        })
        .catch((err) => {
          console.log(JSON.stringify(err.err));
          checkAuth(err)
        });
    }
  }

  let addNew = (name, location, reservations) => {
    let data = { name, location, reservations };
    api
      .post(`${baseURL}/vendors/create`, data)
      .then((res) => {
        window.alert("Vendor Added");
        fetchVendors();
      })
      .catch((err) => {
        checkAuth(err)
      });
  };

  useState(() => {
    const ac = new AbortController();
    store = JSON.parse(window.localStorage.getItem("teenahStores"));

    api = axios.create({
      url: baseURL,
      ...store && { headers: { Authorization: `Bearer ${store.token}` } },
    });

    fetchVendors();
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
          const { createNew } = state
          setState({
            ...state,
            createNew: !createNew,
            ...createNew && { selected: {} }
          })
        }}>
        {state.createNew ? <Close /> : <Add />}
      </div>
    </div >
  );
}
