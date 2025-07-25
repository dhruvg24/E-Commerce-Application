import React from "react";
import "../componentStyles/Pagination.css";
import { useSelector } from "react-redux";
const Pagination = ({
  currentPage,
  onPageChange,
  activeClass = "active",
  nextPageText = "Next",
  prevPageText = "Prev",
  firstPageText = "1st",
  lastPageText = "last",
}) => {
  const { totalPages, products } = useSelector((state) => {
    return state.product;
  });

  if (products.length === 0 || totalPages <= 1) {
    // no pagination
    return null;
  }

  //   generate page nums
  const getPageNumbers = () => {
    const pageNumbers = [];
    const pageWindow = 2;
    // show 2 pages before and after our current page
    for (
      let i = Math.max(1, currentPage - pageWindow);
      i <= Math.min(totalPages, currentPage + pageWindow);
      i++
    ) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };
  return (
    <div className="pagination">
      {/* prev and first button */}
      {currentPage > 1 && (
        <>
          <button className="pagination-btn" onClick={() => onPageChange(1)}>
            {firstPageText}
          </button>
          <button
            className="pagination-btn"
            onClick={() => onPageChange(currentPage - 1)}
          >
            {prevPageText}
          </button>
        </>
      )}

      {/* Display numbers */}
      {getPageNumbers().map((number) => (
        <button
          className={`pagination-btn ${
            currentPage === number ? activeClass : ""
          }`}
          key={number}
          onClick={() => onPageChange(number)}
        >
          {number}
        </button>
      ))}
      {/* Last and next buttons */}
      {currentPage < totalPages && (
        <>
          <button
            className="pagination-btn"
            onClick={() => onPageChange(currentPage + 1)}
          >
            {nextPageText}
          </button>
          <button
            className="pagination-btn"
            onClick={() => onPageChange(totalPages)}
          >
            {lastPageText}
          </button>
        </>
      )}
    </div>
  );
};

export default Pagination;
