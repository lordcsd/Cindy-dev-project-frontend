import { Edit } from "@material-ui/icons";
import { useEffect, useState } from "react";

let ProductCard = ({ props, categories, editCard }) => {
  let [state, setState] = useState({
    title: props ? props.title : "",
    desc: props ? props.desc : "",
    category: props ? props.category : "",
    inStock: props ? props.inStock : 0,
    price: props ? props.price : 0,
    image: props ? props.image : "",
    categories: categories,
  });

  useEffect(() => {
    setState({
      title: props ? props.title : "",
      desc: props ? props.desc : "",
      category: props ? props.category : "",
      inStock: props ? props.inStock : 0,
      price: props ? props.price : 0,
      image: props ? props.image : "",
    });
  }, [props]);

  return (
    <div className="productCard">
      <img className="productImage" src={state.image} />
      <p>{props.title}</p>
      <p>{props.inStock}</p>
      <p>{props.price}</p>
      <Edit
        onClick={() => {
          editCard(props);
        }}
      />
    </div>
  );
};

export default ProductCard;
