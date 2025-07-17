import Product from "../models/productModel.js";
import HandleError from "../utils/handleError.js";
import handleAsyncErrors from "../middlewares/handleAsyncErrors.js";
import APIFunctionality from "../utils/apiFunctionality.js";
// Creating products
export const createProducts = handleAsyncErrors(async (req, res, next) => {
  // console.log(req.body);
  req.body.user=req.user.id;
  // see product schema -> it has a user object refering to user 
  // to get the type of user like admin/user
  const product = await Product.create(req.body);
  res.status(201).json({ message: "Product created successfully", product });
});

// get all products
export const getAllProducts = handleAsyncErrors(async (req, res, next) => {
  //   console.log(req.query);
  const resultsPerPage = 3;
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

  if(page>totalPages && productCount>0){
    return next(new HandleError('This page doesnot exist!', 404))
  }
  
  // APPLYING PAGINATION
  apiFeatures.pagination(resultsPerPage);

  //   console.log(apiFunctionality);
  const products = await apiFeatures.query;

  if(!products || products.length===0){
    return next(new HandleError('No product found'), 404);
  }
  res.status(200).json({
    success: true,
    products,
    productCount,
    resultsPerPage,
    totalPages,
    currentPage:page
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

// get single product
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
