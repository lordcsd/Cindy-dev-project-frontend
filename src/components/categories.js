import { useState, useEffect } from "react";
import axios from "axios";
import { Add, Close } from "@material-ui/icons";

let api, store;

let CategoryCard = ({ props, deleteOne, selectCard, key }) => {
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
        <p>{props.description}</p>
      </div>
    </div>
  );
};

function CreateOrEdit({ props, addNew, updateOne }) {
  let [state, setState] = useState({ _id: "", name: "", description: "" });

  useEffect(() => {
    if (props._id && props.name && props.description) {
      setState({ _id: props._id, name: props.name, description: props.description })
    }
  }, [])

  function handleChange(e) { setState({ ...state, [e.target.name]: e.target.value }) }

  return <div className="createCategory">
    <p>Add New Category</p>
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
        placeholder="description"
        value={state.description}
        name="description"
        onChange={(e) => {
          handleChange(e);
        }}
      />
      <div className="addCate">
        {
          state._id && state.name && state.description ?
            <button className="fillButtonOther" onClick={() => updateOne(state)}>
              Update
            </button>
            : <button className="fillButtonOther" onClick={() => addNew(state.name, state.description)}>
              Add
            </button>
        }
      </div>
    </div>
  </div>
}

export default function Categories({ baseURL, showLoginAgain }) {
  let [state, setState] = useState({
    categories: [],
    name: "",
    description: "",
    createNew: false,
    selected: {}
  });

  let fetchCategories = () => {
    api
      .get(`${baseURL}/categories`)
      .then((res) => {
        setState({ ...state, categories: res.data.categories, createNew: false, selected: {} });
      })
      .catch((err) => console.log(err));
  };

  let deleteOne = (_id) => {
    if (window.confirm("Are You Sure You Want to Delete Category?")) {
      api
        .delete(`${baseURL}/categories/${_id}`)
        .then((res) => {
          window.alert("Category removed")
          fetchCategories();
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
    await setState({ ...state, selected: state.categories[index], createNew: true })
  }

  let updateOne = (params) => {
    if (window.confirm("Are you sure you want to update this record?")) {
      api.patch(`${baseURL}/categories/`, params)
        .then((res) => {
          window.alert("Category Updated");
          fetchCategories();
        })
        .catch((err) => {
          checkAuth(err)
        });
    }
  }

  let addNew = (name, description) => {
    let data = { name, description };
    api
      .post(`${baseURL}/categories`, data)
      .then((res) => {
        window.alert("Category Added");
        fetchCategories();
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
      fetchCategories();
    } else {
      api = axios.create({ url: baseURL });
      fetchCategories();
    }
    return () => ac.abort();
  }, []);

  return (
    <div className="categories">
      <h4>Manage Categories</h4>
      <div className="categoriesHead"></div>
      <div className="categoriesCardContain">
        {!state.createNew ? state.categories.map((each, index) => (
          <CategoryCard props={each} key={index} deleteOne={deleteOne} selectCard={() => selectCard(index)} />
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
