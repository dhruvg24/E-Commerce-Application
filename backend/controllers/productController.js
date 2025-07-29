import Product from "../models/productModel.js";
import HandleError from "../utils/handleError.js";
import handleAsyncErrors from "../middlewares/handleAsyncErrors.js";
import APIFunctionality from "../utils/apiFunctionality.js";
import {v2 as cloudinary} from 'cloudinary'
// Creating products
export const createProducts = handleAsyncErrors(async (req, res, next) => {
  // console.log(req.body);

  let image = [];

  if(typeof req.body.image==='string'){
    // if this is a single image[string]
    image.push(req.body.image);
  }else{
    // if this is an array (multiple images), assign this req.body.image to image array itself.
    image = req.body.image;
  }

  const imageLinks = [];

  // admin can insert multiple images.

  for(let i = 0;i<image.length;i++){
    const res = await cloudinary.uploader.upload(image[i],{folder:'products'})

    imageLinks.push({
      public_id:res.public_id,
      url:res.secure_url
    })
    // folder in cloudinary
  }
  req.body.image = imageLinks;

  req.body.user = req.user.id;
  // see product schema -> it has a user object refering to user
  // to get the type of user like admin/user
  const product = await Product.create(req.body);
  res.status(201).json({ success: "Product created successfully", product });
});

// get all products
export const getAllProducts = handleAsyncErrors(async (req, res, next) => {
  //   console.log(req.query);
  const resultsPerPage = 4;
  const apiFeatures = new APIFunctionality(Product.find(), req.query)
    .search()
    .filter();

  //   getting filtered query before pagination
  // reason:
  // Issue that may come
  // say we filter by category = shirts, we have in total 5 pages, but after filtering we have only 2 shirts, which can be made available in single page and no need to make appear 5 pages.

  const filteredQuery = apiFeatures.query.clone();
  const productCount = await filteredQuery.countDocuments();
  // console.log(productCount);

  // calculate total pages based on filtered count
  const totalPages = Math.ceil(productCount / resultsPerPage);
  // console.log(totalPages);

  const page = Number(req.query.page) || 1;
  // page is the current page, as asked by user[frontend]

  if (page > totalPages && productCount > 0) {
    return next(new HandleError("This page doesnot exist!", 404));
  }

  // APPLYING PAGINATION
  apiFeatures.pagination(resultsPerPage);

  //   console.log(apiFunctionality);
  const products = await apiFeatures.query;

  if (!products || products.length === 0) {
    return next(new HandleError("No product found"), 404);
  }
  res.status(200).json({
    success: true,
    products,
    productCount,
    resultsPerPage,
    totalPages,
    currentPage: page,
  });
});

// update product
export const updateProduct = handleAsyncErrors(async (req, res, next) => {
  // console.log(product);
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    return next(new HandleError("Product not found", 404));
  }
  res.status(200).json({
    success: "Product data updated successfully",
    product,
  });
});

// Delete a product
export const deleteProduct = handleAsyncErrors(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return next(new HandleError("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});

// Creating and Updating Reviews - Accessible to user
export const createOrUpdateReviewForProduct = handleAsyncErrors(
  async (req, res, next) => {
    // console.log(req.body);
    // console.log(req.user.id);
    const { rating, comment, productId } = req.body;
    const review = {
      // see schema
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };
    const product = await Product.findById(productId);
    // console.log(product);

    if (!product) {
      return next(new HandleError("Product not found", 404));
    }

    const reviewExists = product.reviews.find(
      (review) => review.user.toString() === req.user.id.toString()
    );
    // refer db schema for reviews..., product etc.
    if (reviewExists) {
      product.reviews.forEach((review) => {
        if (review.user.toString() === req.user.id.toString()) {
          // updating
          (review.rating = Number(rating)), (review.comment = comment);
        }
      });
    } else {
      // if doesnot exist -> create new one.

      product.reviews.push(review);
    }
    // increment number of reviews
    product.numOfReviews = product.reviews.length;
    // avg rating update
    let sum = 0;
    product.reviews.forEach((review) => {
      sum = sum + review.rating;
    });

    product.ratings =
      product.reviews.length > 0 ? sum / product.reviews.length : 0;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      product,
    });
  }
);

// accessing single product
export const getSingleProduct = handleAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new HandleError("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

// Getting reviews [single product can have multiple reviews]
export const getProductReviews = handleAsyncErrors(async (req, res, next) => {
  // console.log(req.query.id);
  const product = await Product.findById(req.query.id);
  if (!product) {
    return next(new HandleError("Product not found", 400));
  }
  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// Delete Reviews
export const deleteReview = handleAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);
  if (!product) {
    return next(new HandleError("Product not found", 400));
  }
  const reviews = product.reviews.filter(
    (review) => review._id.toString() !== req.query.id.toString()
  );
  // all except the requested id will be displayed
  // console.log(reviews);
  let sum = 0;
  reviews.forEach((review) => {
    sum += review.rating;
  });
  // find avg
  const ratings = reviews.length > 0 ? sum / reviews.length : 0;
  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    { reviews, ratings, numOfReviews },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success:true,
    message:'Review deleted successfully'
  })
});
// ADMIN-Get all products on the website.
export const getAdminProducts = handleAsyncErrors(async (req, res, next) => {
  const products = await Product.find();
  res.status(200).json({
    success: true,
    products,
  });
});
