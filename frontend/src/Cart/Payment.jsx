import React from 'react'
import '../CartStyles/Payment.css'
import PageTitle from '../components/PageTitle'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CheckoutPath from './CheckoutPath'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useSelector } from 'react-redux'
const Payment = () => {
    const orderItem = JSON.parse(sessionStorage.getItem('orderItem'));
    const {user} = useSelector(state=>state.user)
    const {shippingInfo} = useSelector(state=>state.cart)

    const completePayment = async(amount)=>{
      // refer payment controller(backend)
      // both sendAPIKey and processPayment function should be triggered
      const {data:keyData} = await axios.get('/api/getKey');
      const {key} = keyData;
      
      const {data:orderData} = await axios.post('/api/payment/process', {amount});
      // console.log(orderData);

      const {order} = orderData;
      // console.log(order);


      // Open Razorpay Checkout
      const options = {
        key: key, // Replace with your Razorpay key_id
        amount: amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: 'INR',
        name: 'Dhruv Garg',
        description: 'Ecommerce website payment transaction',
        order_id: order.id, // This is the order_id created in the backend
        callback_url: '/api/paymentVerification', // Your success URL
        prefill: {
          name: user.name,
          email: user.email,
          contact: shippingInfo.contactnumber
        },
        theme: {
          color: '#F37254'
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();


    }
  return (
    <>
    <PageTitle title='Payment Processing'/>
    <Navbar />
    <CheckoutPath activePath={2} />

    <div className='payment-container'>
        <Link to ='/order/confirm' className='payment-go-back'>Go Back</Link>
        <button className='payment-btn' onClick={()=>completePayment(orderItem.total)}>Pay {orderItem.total}/-</button>

        {/* will provide order items total as in backend razorpay has amount as one of the parameter(in payment controller amount is one of the options) */}
    </div>
    <Footer />

    </>
  )
}

export default Payment