import React, { useEffect } from "react";
import "../pageStyles/Products.css";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useDispatch, useSelector } from "react-redux";
import Product from "../components/Product";
import { getProduct, removeErrors } from "../features/products/productSlice";
import { toast } from "react-toastify";
import LoadingContent from "../components/LoadingContent";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import ProductNotFound from "../components/ProductNotFound";
import { useState } from "react";
import Pagination from "../components/Pagination";
const Products = () => {
  const { loading, error, products,resultsPerPage,productCount } = useSelector((state) => state.product);

  const dispatch = useDispatch();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  // console.log(searchParams);
  const keyword = searchParams.get("keyword");
  // console.log(keyword);
  const pageFromURL = parseInt(searchParams.get('page'), 10) || 1
  const [currentPage, setCurrentPage] = useState(pageFromURL)
  const navigate = useNavigate()
  useEffect(() => {
    dispatch(getProduct({ keyword, page:currentPage }));
  }, [dispatch, keyword, currentPage]);

  useEffect(() => {
    if (error) {
      toast.error(error.message, { position: "top-center", autoClose: 3000 });
      dispatch(removeErrors());
    }
  }, [dispatch, error]);


  const handlePageChange = (page)=>{
    if(page!==currentPage){
      setCurrentPage(page);
      const newSearchParams= new URLSearchParams(location.search);
      if(page===1){
        newSearchParams.delete('page')
      }else{
        newSearchParams.set('page', page)
      }
      Navigate(`?${newSearchParams.toString()}`)
    }
  }
  return (
    <>
      {loading ? (
        <LoadingContent />
      ) : (
        <>
          <PageTitle title="All Products" />
          <Navbar />
          <div className="products-layout">
            <div className="filter-section">
              <h3 className="filter-heading">CATEGORIES</h3>
              {/* Render categories */}
            </div>
            <div className="products-section">
              {products.length > 0 ? (
                <div className="products-product-container">
                  {products.map((product) => (
                    <Product key={product._id} product={product} />
                  ))}
                </div>
              ) : (
                <ProductNotFound keyword={keyword} />
              )}
              <Pagination currentPage={currentPage} onPageChange={handlePageChange} />
            </div>
          </div>
          <Footer />
        </>
      )}
    </>
  );
};

export default Products;
