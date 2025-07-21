// Individual product details
import React, { useEffect, useState } from "react";
import "../pageStyles/ProductDetails.css";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Ratings from "../components/Ratings";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  getProductDetails,
  removeErrors,
} from "../features/products/productSlice";
import { toast } from "react-toastify";
import LoadingContent from "../components/LoadingContent";

const ProductDetails = () => {
  const [userRating, setUserRating] = useState(0);
  const handleRatingChange = (newRating) => {
    setUserRating(newRating);
    // console.log(`Rating changed to : ${newRating}`);
  };
  const { loading, error, product } = useSelector((state) => state.product);
  const dispatch = useDispatch();

  const { id } = useParams();

  useEffect(() => {
    if (id) {
      dispatch(getProductDetails(id));
    }
    return () => {
      dispatch(removeErrors());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (error) {
      toast.error(error.message, { position: "top-center", autoClose: 3000 });
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  if (loading) {
    return (
      <>
        <Navbar />
        <LoadingContent />
        <Footer />
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <PageTitle title="Product details" />
        <Navbar />
        <Footer />
      </>
    );
  }
  return (
    <>
      <PageTitle title={`${product.name} - Details`} />
      <Navbar />
      <div className="product-details-container">
        <div className="product-detail-container">
          <img
            src={product.image[0].url.replace("./", "/")}
            alt={product.name}
            className="product-detail-image"
          />

          <div className="product-info">
            <h2>{product.name}</h2>
            <p className="product-description">{product.description}</p>

            <p className="product-price">Price: {product.price}/-</p>

            <div className="product-rating">
              <Ratings value={product.ratings} disabled={true} />
              <span className="productCardSpan">
                ({product.numOfReviews}{" "}
                {product.numOfReviews === 1 ? "Review" : "Reviews"})
              </span>
            </div>
            <div className="stock-status">
              <span className={product.stock > 0 ? `in-stock` : `out-of-stock`}>
                {product.stock > 0
                  ? `In Stock (${product.stock} available)`
                  : "Out of Stock"}
              </span>
            </div>

            {product.stock > 0 && (
              <>
                <div className="quantity-controls">
                  <span className="quantity-label">Quantity:</span>
                  <button className="quantity-button">-</button>
                  <input
                    type="text"
                    value={1}
                    className="quantity-value"
                    readOnly
                  />

                  <button className="quantity-button">+</button>
                </div>
                <button className="add-to-cart-btn">Add to Cart</button>
              </>
            )}

            <form className="review-form">
              <h3>Write a review</h3>
              {/* stars */}
              <Ratings
                value={0}
                disabled={false}
                onRatingChange={handleRatingChange}
              />
              <textarea
                placeholder="Write your Review here..."
                className="review-input"
              ></textarea>
              <button className="submit-review-btn">Submit Review</button>
            </form>
          </div>
        </div>

        <div className="reviews-container">
          <h3 className="">Customer Reviews</h3>
          {product.reviews && product.reviews.length > 0 ? (
            <div className="reviews-section">
              {product.reviews.map((review,index) => (
                <div className="review-item" key={index}>
                  <div className="review-header">
                    <Ratings value={review.rating} disabled={true} />
                  </div>
                  <p className="review-comment">{review.comment}</p>
                  <p className="review-name">By: {review.name}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-reviews">
              No reviews yet. Be the first to review this product!
            </p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetails;
