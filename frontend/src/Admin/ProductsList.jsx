import React, { useEffect } from "react";
import "../AdminStyles/ProductsList.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageTitle from "../components/PageTitle";
import { Link } from "react-router-dom";
import { Delete, Edit } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteProduct,
  fetchAdminProducts,
  removeErrors,
  removeSuccess,
} from "../features/admin/adminSlice.js";
import {toast} from "react-toastify";
import LoadingContent from "../components/LoadingContent";
const ProductsList = () => {
  const { products, loading, error, deleting } = useSelector((state) => state.admin);
  // console.log(products);
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

  const handleDelete = (productId)=>{
    const isConfirmed = window.confirm('Are you sure you want to delete this product?');
    // console.log(isConfirmed);
    if(isConfirmed){
      // delete
      dispatch(deleteProduct(productId)).then((action)=>{
        if(action.type==='/admin/deleteProduct/fulfilled'){
          toast.success('Product deleted successfully', {position:'top-center', autoClose:3000});
          dispatch(removeSuccess());
        }
      });
    }

  }

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
                      <button className="action-icon delete-icon" disabled={deleting[product._id]} onClick={()=>handleDelete(product._id)}>
                      {deleting[product._id]?<LoadingContent />:<Delete />}
                      </button>
                      
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
