import React, { useEffect } from "react";
import "../AdminStyles/ProductsList.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageTitle from "../components/PageTitle";
import { Link } from "react-router-dom";
import { Delete, Edit } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdminProducts,
  removeErrors,
} from "../features/admin/adminSlice.js";
import {toast} from "react-toastify";
import LoadingContent from "../components/LoadingContent";
const ProductsList = () => {
  const { products, loading, error } = useSelector((state) => state.admin);
  console.log(products);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error, { position: "top-center", autoClose: 3000 });
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  if(!products || products.length===0){
    return (
      <div className="product-list-container">
        <h1 className="product-list-title">Admin Products</h1>
        <p className="no-admin-products">No Products found!</p>
      </div>
    )
  }
  return (
    <>
      {loading ? (
        <LoadingContent />
      ) : (
        <>
          <Navbar />
          <PageTitle title="All Products" />
          <div className="product-list-container">
            <h1 className="product-list-title">All Products</h1>
            <table className="product-table">
              <thead>
                <tr>
                  <th>Sr. No.</th>
                  <th>Product Image</th>
                  <th>Product Name</th>
                  <th>Price</th>
                  <th>Ratings</th>
                  <th>Category</th>
                  <th>Stock</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={product._id}>
                    <td>{index + 1}</td>
                    <td>
                      <img
                        src={product.image[0].url}
                        alt={product.name}
                        className="admin-product-image"
                      />
                    </td>
                    <td>{product.name}</td>
                    <td>{product.price}/-</td>
                    <td>{product.ratings}</td>
                    <td>{product.category}</td>
                    <td>{product.stock}</td>
                    <td>{new Date(product.createdAt).toLocaleString()}</td>
                    <td>
                      <Link
                        to={`/admin/product/${product._id}`}
                        className="action-icon edit-icon"
                      >
                        <Edit />
                      </Link>
                      <Link
                        to={`/admin/product/${product._id}`}
                        className="action-icon delete-icon"
                      >
                        <Delete />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Footer />
        </>
      )}
    </>
  );
};

export default ProductsList;
