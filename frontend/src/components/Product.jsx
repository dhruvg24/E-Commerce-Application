import React, { useState } from "react";
import "../pageStyles/Product.css";
import { Link } from "react-router-dom";
import Ratings from "./Ratings";
const Product = ({product}) => {
    const [rating, setRating] = useState(0);
    const handleRatingChange = (newRating)=>{
      setRating(newRating);
      console.log(`Rating is updated to : ${newRating}`)
    }
  return (
    <Link to={`/product/${product._id}`} className="product_id">
    <div className="product-card">
      <img src={product.image[0].url} alt={product.name} className="product-image-card"/>
      <div className="product-details">
        <h3 className="product-title">{product.name}</h3>
        <p className="home-price">
          Price {""}{product.price}/-
        </p>
        <div className="rating_container">
            <Ratings value={product.ratings} onRatingChange = {handleRatingChange} disabled={false}/>
        </div>
        <span className="productCardSpan">
          {product.numOfReviews} {product.numOfReviews===1?"Review":"Reviews"} 
        </span>
        <button className="add-to-cart">View Details</button>
      </div>
    </div>
    </Link>
  );
};

export default Product;
