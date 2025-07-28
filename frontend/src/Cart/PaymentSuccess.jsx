import React from "react";
import "../CartStyles/PaymentSuccess.css";
import { Link, useSearchParams } from "react-router-dom";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { toast } from "react-toastify";

// import  from "../features/cart/cartSlice.js";
import { removeErrors, removeSuccess,createOrder } from "../features/order/orderSlice";
import { clearCart } from "../features/cart/cartSlice";
import LoadingContent from "../components/LoadingContent";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams("reference");
  const reference = searchParams.get("reference");
  const { cartItems, shippingInfo } = useSelector((state) => state.cart);
  const { success, loading, error } = useSelector((state) => state.order);

  const dispatch = useDispatch();

  useEffect(() => {
    const createOrderData = async () => {
      try {
        const orderItem = JSON.parse(sessionStorage.getItem("orderItem"));
        if(!orderItem){
            return;
            // when user goes back to cart after order success, orderItem is already been deleted from localStorage, so to avoid any reference error, return from here.
        }
        const orderData = {
          //refer orderModel
          shippingInfo: {
            address: shippingInfo.address,
            city: shippingInfo.city,
            state: shippingInfo.state,
            country: shippingInfo.country,
            pinCode: shippingInfo.pincode,
            phoneNumber: shippingInfo.contactnumber,
          },
          orderItems: cartItems.map((item) => ({
            // orderItems is an array
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            product: item.product,
          })),
          paymentInfo: {
            id: reference,
            status: "succeeded",
          },
          itemPrice: orderItem.subtotal,
          taxPrice: orderItem.tax,
          shippingPrice: orderItem.shippingCharges,
          totalPrice: orderItem.total,
        };

        console.log("Sending data", orderData);

        dispatch(createOrder(orderData));
        // orderData is the payload

        // after this remove orderItem from sessionStorage.

        sessionStorage.removeItem("orderItem");
      } catch (err) {
        console.log("Order creation error", err.message);
        toast.error(err.message || "Order creation error", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    };
    createOrderData();
  }, []);
//   above to run only once i.e. on mount only.

  useEffect(() => {
    if (success) {
      toast.success("Order Placed", {
        position: "top-center",
        autoClose: 3000,
      });
      dispatch(clearCart())
      dispatch(removeSuccess());
    }
  }, [dispatch, success]);

  useEffect(() => {
    if (error) {
      toast.error(error, { position: "top-center", autoClose: 3000 });
      dispatch(removeErrors());
    }
  }, [dispatch, error]);
  return (
    <>
    {loading?(<LoadingContent/>):(<>
      <Navbar />
      <PageTitle title="Payment Status" />
      <div className="payment-success-container">
        <div className="success-content">
          <div className="success-icon">
            <div className="checkmark"></div>
          </div>
          <h1>Order Confirmed!</h1>
          <p>
            Your Payment was successful, Reference Id:{" "}
            <strong>{reference}</strong>
          </p>

          <Link className="explore-btn" to="/orders/user">
            View Orders
          </Link>
        </div>
      </div>
      <Footer />
    </>)}
    </>
  );
};

export default PaymentSuccess;
