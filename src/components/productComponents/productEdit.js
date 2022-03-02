import { useEffect, useState } from "react";

const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};

export default function ProductEdit({
  props,
  categories,
  vendors,
  oldTicket,
  deleteOne,
  updateOne,
  saveOne,
}) {
  let [state, setState] = useState({
    _id: props ? props._id : "",
    image: props ? props.image : "",
    title: props ? props.title : "",
    desc: props ? props.desc : "",
    price: props ? props.price : 0,
    inStock: props ? props.inStock : 0,
    categories,
    category: "",
    vendors,
    vendor: "",
    oldTicket,
  });

  let handleUpload = (e) => {
    convertToBase64(e.target.files[0])
      .then((res) => {
        setState({ ...state, image: res });
      })
      .catch((err) => console.log("imageConvertionError: ", err));
  };

  let handleChange = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  let toMap = ["title", "desc", "category", "vendor", "inStock", "price"];

  useEffect(() => {
    setState({
      ...state,
      _id: props._id,
      title: props.title,
      desc: props.desc,
      category: props.category ? props.category : categories[0]['name'],
      vendor: props.vendor ? props.vendor : vendors[0]["name"],
      inStock: props.inStock,
      price: props.price,
      image: props.image,
    });
  }, []);

  return (
    <div className="editProducts">
      <div className="editTop">
        <p>Edit Product</p>
        {state.oldTicket ? (
          <div>
            <button
              className="fillButtonOther"
              onClick={() => updateOne(state)}
            >
              Update
            </button>
            <button
              className="outlineButtonOther"
              onClick={() => {
                deleteOne(props._id);
              }}
            >
              Delete
            </button>
          </div>
        ) : (
          <button className="fillButtonOther" onClick={() => saveOne(state)}>
            Save
          </button>
        )}
      </div>
      <div id="imageInput">
        <img src={state.image} />

        <div>
          <p>Image</p>
          <input type="file" onChange={handleUpload} />
        </div>
      </div>
      {toMap.map((each, index) => {
        return (
          <div className="eachProp" key={index}>
            <div>
              <p>{each}</p>
            </div>
            {each == "category" ? (
              <select
                defaultValue={categories.indexOf(props.category)}
                onChange={(e) => {
                  setState({
                    ...state,
                    category: categories[e.target.value]["name"],
                  });
                }}
              >
                {categories.map((eachCat, catIndex) => {
                  return (
                    <option key={catIndex} value={catIndex}>
                      {eachCat.name}
                    </option>
                  );
                })}
              </select>
            ) : each == "vendor" ? <select
              defaultValue={vendors.find(e => e['name'] == props.vendor)}
              onChange={(e) => {
                setState({
                  ...state,
                  vendor: vendors[e.target.value]["name"],
                });
              }}
            >
              {vendors.map((eachVen, venIndex) => {
                return (
                  <option key={venIndex} value={venIndex}>
                    {eachVen.name}
                  </option>
                );
              })}
            </select> :
              (
                <input
                  type={["price", "inStock"].includes(each) ? "number" : "text"}
                  name={each}
                  value={state[each]}
                  onChange={handleChange}
                />
              )}
          </div>
        );
      })}
    </div>
  );
}
