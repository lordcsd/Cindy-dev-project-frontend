import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./productComponents/productCard";
import ProductEdit from "./productComponents/productEdit";
import { SearchOutlined } from "@material-ui/icons";
let store, api;

export default function Products({ baseURL, showLoginAgain }) {
  let [state, setState] = useState({
    categories: [],
    products: [],
    addingNew: false,
    searchInput: "",
    searchResult: [],
    presentEdit: {},
    oldTicket: false,
    pagesList: [],
  });

  let validateInputs = (body) => {
    return (
      body.image.length > 0 &&
      body.title.length > 0 &&
      body.desc.length > 0 &&
      body.inStock > 0 &&
      body.price > 0
    );
  };

  async function checkAuth(err) {
    if (err.message.includes("401")) {
      showLoginAgain();
    } if (err.message.includes("422")) {
      alert("Record already exists")
    }
  }

  let fetchProducts = async (page = 1, search = "") => {
    let url = `${baseURL}/products`;
    if (search && page) {
      url += "?search=" + search + "&page=" + page;
    } else if (search) {
      url += "?search=" + search;
    } else if (page) {
      url += "?page=" + page;
    }

    axios
      .get(url)
      .then((getRes) => {
        let pages = [];
        for (let i = 1; i <= Number(getRes.data.last_page); i++) {
          pages.push(i);
        }

        setState({
          ...state,
          products: getRes.data.products,
          categories: getRes.data.categories.map((each) => each.name),
          page: getRes.data.page,
          last_page: getRes.data.last_page,
          pagesList: pages,
        });
      })
      .catch((err) => {
        checkAuth(err)
      });
  };

  let deleteOne = (_id) => {
    if (window.confirm("Are you Sure You Want To Delete This Product?")) {
      api
        .delete(`${baseURL}/products/${_id}`)
        .then((res) => {
          toggleAddTicket();
        })
        .catch((err) => {
          checkAuth(err)
        });
    }
  };

  let updateOne = (body) => {
    if (validateInputs(body)) {
      if (window.confirm("Are You Sure Want To Update This Product?")) {
        api
          .patch(`${baseURL}/products`, body)
          .then((res) => {
            toggleAddTicket();
          })
          .catch((err) => {
            checkAuth(err)
          });
      }
    } else {
      alert("All Fields must be filled");
    }
  };

  let toggleAddTicket = async (productToEdit) => {
    await setState({
      ...state,
      addingNew: !state.addingNew,
      oldTicket: productToEdit ? true : false,
      presentEdit: productToEdit ? productToEdit : {},
    });
  };

  let saveOne = (body) => {
    if (validateInputs(body)) {
      api
        .post(`${baseURL}/products`, body)
        .then((res) => {
          alert("saved");
          toggleAddTicket();
        })
        .catch((err) => {
          checkAuth(err)
        });
    }
  };

  let arrayWhichDefaultAll = ["All", ...state.categories];

  let fetchByCategory = async (whichCategory) => {
    if (whichCategory === 0) {
      fetchProducts();
    } else {
      let data = {
        name: arrayWhichDefaultAll[whichCategory],
      };
      await api
        .post(`${baseURL}/products/byCategory`, data)
        .then(async (res) => {
          await setState({ ...state, products: [] });
          await setState({ ...state, products: res.data.products, pagesList: [1] });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  useEffect(() => {
    if (!state.addingNew) {
      fetchProducts();
    }
  }, [state.addingNew]);

  useEffect(() => {
    const ac = new AbortController();
    store = JSON.parse(window.localStorage.getItem("teenahStores"));
    if (store) {
      api = axios.create({
        headers: { Authorization: `Bearer ${store.token}` },
      });
      fetchProducts();
    } else {
      api = axios.create({
        url: baseURL,
      });
      fetchProducts();
    }
    return () => ac.abort();
  }, []);

  return (
    <div className="productsRoot">
      <div className="titleDiv">
        <h4>Manage Products</h4>
        <button className="fillButtonOther" onClick={() => toggleAddTicket()}>
          {!state.addingNew ? "Add new Products" : "Close Product Creation"}
        </button>
      </div>
      <div className="searchBar">
        <select onChange={(e) => fetchByCategory(Number(e.target.value))}>
          {arrayWhichDefaultAll.map((each, index) => (
            <option key={index} value={index}>
              {each}
            </option>
          ))}
        </select>
        <div>
          <input
            className="input"
            value={state.searchInput}
            placeholder="Search Products"
            onChange={async (e) => {
              await setState({
                ...state,
                searchInput: e.target.value,
              });
            }}
          />
          <SearchOutlined
            fontSize="small"
            onClick={() => {
              fetchProducts(1, state.searchInput);
            }}
          />
        </div>
      </div>
      <div className="ProductsCardContain">
        {!state.addingNew ? (
          <div className="productsHeader">
            <p>Photo</p>
            <p>Title</p>
            <p>In Stock</p>
            <p>Price</p>
            <p>Actions</p>
          </div>
        ) : (
          <></>
        )}

        {!state.addingNew ? (
          state.products.map((each, index) => {
            return (
              <ProductCard
                baseURL={baseURL}
                props={each}
                key={index}
                editCard={toggleAddTicket}
                categories={state.categories}
              />
            );
          })
        ) : (
          <ProductEdit
            categories={state.categories}
            props={state.presentEdit}
            oldTicket={state.oldTicket}
            saveOne={saveOne}
            updateOne={updateOne}
            deleteOne={deleteOne}
          />
        )}
      </div>
      {
        !state.addingNew ?
          <div className="pageButtons">
            <p>Pages</p>
            {state.pagesList.map((e, index) => {
              return (
                <div
                  className="pageButton"
                  key={index}
                  onClick={() => {
                    fetchProducts(e, state.searchInput);
                  }}
                >
                  <p>{e}</p>
                </div>
              );
            })}
          </div> : <></>
      }

    </div>
  );
}
