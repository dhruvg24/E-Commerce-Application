import React from 'react'
import '../CartStyles/PaymentSuccess.css'
import { Link, useSearchParams } from 'react-router-dom'
const PaymentSuccess = () => {
    const [searchParams] = useSearchParams('reference');
    const reference = searchParams.get('reference');
  return (
    <div className='payment-success-container'>
        <div className='success-icon'>
            <div className='checkmark'>

            </div>
        </div>
        <h1>Order Confirmed!</h1>
        <p>Your Payment was successful, Reference Id: <strong>{reference}</strong></p>

        <Link className='explore-btn' to='/'>Explore more products!</Link>
    </div>
  )
}

export default PaymentSuccess