import React, { useEffect } from "react";
import "../AdminStyles/OrdersList.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageTitle from "../components/PageTitle";
import { Link } from "react-router-dom";
import { Delete, Edit } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { clearMessage, deleteOrder, fetchAllOrders, removeErrors, removeSuccess } from "../features/admin/adminSlice";
import LoadingContent from "../components/LoadingContent";
import { toast } from "react-toastify";
const OrdersList = () => {
  const { orders, loading, error, success, message } = useSelector((state) => state.admin);
  console.log(orders);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  

  
  const handleDelete = (id)=>{
    const confirm = window.confirm("Are you sure you want to delete this order?");

    if(confirm){
        dispatch(deleteOrder(id));
    }
  }

  useEffect(() => {
    if (error) {
      toast.error(error, { position: "top-center", autoClose: 3000 });
      dispatch(removeErrors());
    }
    if(success){
        toast.success(message, { position: "top-center", autoClose: 3000 });
      dispatch(removeSuccess());
      dispatch(clearMessage());
      dispatch(fetchAllOrders());
    //   after deletion all remaining orders must be displayed.
    }
  }, [dispatch, error,success,message]);


  if (orders && orders.length === 0) {
    return (
        <div className="no-orders-container">
            <p>
                No orders Found!
            </p>

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
          <PageTitle title="All Orders" />
          <div className="ordersList-container">
            <h1 className="ordersList-title">All Orders</h1>
            <div className="ordersList-table-container">
              <table className="ordersList-table">
                <thead>
                  <tr>
                    <th>Sr. No.</th>
                    <th>Order ID</th>
                    <th>Status</th>
                    <th>Total Price</th>
                    <th>No. of Items</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {orders &&
                    orders.map((order, index) => (
                      <tr key={order._id}>
                        <td>{index + 1}</td>
                        <td>{order._id}</td>
                        <td
                          className={`order-status ${order.orderStatus.toLowerCase()}`}
                        >
                          {order.orderStatus}
                        </td>
                        <td>{order.totalPrice.toFixed(2)}/-</td>
                        <td>{order.orderItems.length}</td>
                        <td>
                          <Link
                            to={`/admin/order/${order._id}`}
                            className="action-icon edit-icon"
                          >
                            <Edit />
                          </Link>
                          <button className="action-btn delete-icon" onClick={()=>handleDelete(order._id)}>
                            <Delete />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
          <Footer />
        </>
      )}
    </>
  );
};

export default OrdersList;
