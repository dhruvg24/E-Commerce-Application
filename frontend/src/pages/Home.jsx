import React, { useEffect } from 'react'
import Footer from '../components/Footer'
import '../pageStyles/Home.css'
import Navbar from '../components/Navbar'
import ImageSlider from '../components/ImageSlider'
import Product from '../components/Product'
import PageTitle from '../components/PageTitle'
import { useDispatch, useSelector } from 'react-redux'
import { getProduct, removeErrors } from '../features/products/productSlice.js'
import LoadingContent from '../components/LoadingContent.jsx'
import { toast } from 'react-toastify'
// const products= [
//         {
//             "_id": "68779004414a288bc475f2dd",
//             "name": "Product 1",
//             "description": "Product Description 1",
//             "price": 300,
//             "ratings": 4,
//             "image": [
//                 {
//                     "public_id": "test_id",
//                     "url": "test_url",
//                     "_id": "68779004414a288bc475f2de"
//                 }
//             ],
//             "category": "test category 1",
//             "stock": -2,
//             "numOfReviews": 1,
//             "reviews": [
//                 {
//                     "user": "6878fe27aead1c993eaeab7b",
//                     "name": "Dhruv Garg",
//                     "rating": 4,
//                     "comment": "awesome",
//                     "_id": "687a17e8c5459c6e5bcfc65a"
//                 }
//             ],
//             "createdAt": "2025-07-16T11:41:56.244Z",
//             "__v": 1
//         },
//         {
//             "_id": "6878f106e8011276e841cd57",
//             "name": "Product 2",
//             "description": "Product Description 2",
//             "price": 400,
//             "ratings": 0,
//             "image": [
//                 {
//                     "public_id": "test_id_2",
//                     "url": "test_url_2",
//                     "_id": "6878f106e8011276e841cd58"
//                 }
//             ],
//             "category": "trouser",
//             "stock": 1,
//             "numOfReviews": 0,
//             "reviews": [
//                 {
//                     "name": "test user 2",
//                     "rating": 3,
//                     "comment": "test comment xyz",
//                     "_id": "6878f106e8011276e841cd59"
//                 }
//             ],
//             "user": "6878bb86e88908875662cb32",
//             "createdAt": "2025-07-17T12:48:06.714Z",
//             "__v": 0
//         },
//         {
//             "_id": "6879186ce3de0fe746c79a75",
//             "name": "Product 3",
//             "description": "Product Description 3",
//             "price": 600,
//             "ratings": 0,
//             "image": [
//                 {
//                     "public_id": "test_id_3",
//                     "url": "test_url_3",
//                     "_id": "6879186ce3de0fe746c79a76"
//                 }
//             ],
//             "category": "shirts",
//             "stock": 1,
//             "numOfReviews": 0,
//             "reviews": [
//                 {
//                     "name": "test user 1",
//                     "rating": 4,
//                     "comment": "test comment",
//                     "_id": "6879186ce3de0fe746c79a77"
//                 }
//             ],
//             "user": "6878fe27aead1c993eaeab7b",
//             "createdAt": "2025-07-17T15:36:12.070Z",
//             "__v": 0
//         },
        
//     ]

const Home = () => {
    // useSelector hook
    const {loading,error,products,productCount} = useSelector((state)=>
        state.product);

    // dispatch
    const dispatch=useDispatch();
    useEffect(()=>{
        dispatch(getProduct({keyword:''}))
    },[dispatch])

    useEffect(()=>{
        if(error){
            toast.error(error.message, {position:'top-center',autoClose:3000});
            dispatch(removeErrors())
        }
    },[dispatch,error])
  return (
    <>

    {loading?(<LoadingContent />):(<>
    <PageTitle title="Home"/>
    <Navbar />
    <ImageSlider />
    <div className='home-container'>
        <h2 className='home-heading'>Trending Now</h2>
        <div className='home-product-container'>
            {
                products.map((product,index)=>(
                        <Product product={product} key={index}/>
                ))
            }
            
        </div>
        <Footer />
    </div>
    </>)}
    </>
  )
}

export default Home