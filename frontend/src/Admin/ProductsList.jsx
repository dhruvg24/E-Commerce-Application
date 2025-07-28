import React from 'react'
import '../AdminStyles/ProductsList.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageTitle from '../components/PageTitle'
const ProductsList = () => {
  return (
    <>
    <Navbar />
    <PageTitle title='All Products' />
    <div className='product-list-container'>
        <h1 className='product-list-title'>
            All Products
        </h1>
    </div>
    <Footer />
    </>
  )
}

export default ProductsList