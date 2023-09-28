import { product } from "../models/productModel.js";
import { ErrorHandler } from "../utils/ErrorHandler.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import { ApiFeatures } from "../utils/apiFeatures.js";

// Adding CRUD Operations to Products

export const createProduct = catchAsyncErrors(async (req, res, next) => {
  req.body.userName = req.user.name;
  req.body.user = req.user.id;
  const createdProduct = await product.create(req.body);

  res.status(200).json({
    success: true,
    createdProduct,
  });
});

export const getAllProducts = catchAsyncErrors(async (req, res, next) => {
  let resultPerPage = 5;
  const productCount = await product.countDocuments();
  const apiFeatures = new ApiFeatures(product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);
  const allProduct = await apiFeatures.query;

  res.status(200).json({
    success: true,
    message: allProduct,
    productCount,
  });
});

export const updateProduct = catchAsyncErrors(async (req, res, next) => {
  let findedProduct = await product.findById(req.params.id);

  if (!findedProduct) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const updatedProduct = await product.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
    message: "Updated",
  });
});

export const deleteProduct = catchAsyncErrors(async (req, res, next) => {
  let findedProduct = await product.findById(req.params.id);

  if (!findedProduct) {
    return next(new ErrorHandler("Product not found", 404));
  }
  await findedProduct.deleteOne();

  res.status(200).json({
    success: true,
    message: "Deleted Product",
  });
});

export const getSIngleProduct = catchAsyncErrors(async (req, res, next) => {
  const singleProduct = await product.findById(req.params.id);

  if (!singleProduct) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(404).json({
    success: true,
    message: singleProduct,
  });
});

// creating product review

export const productRev = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const selectedProduct = await product.findById(productId);

  if (!selectedProduct) {
    return next(new ErrorHandler("Product not found", 404));
  }
  const isReviewed = selectedProduct.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    selectedProduct.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    selectedProduct.reviews.push(review);
    selectedProduct.numOfReviews = selectedProduct.reviews.length;
  }

  let avg = 0;

  selectedProduct.reviews.forEach((rev) => {
    avg = avg + rev.rating;
  });

  selectedProduct.rating = avg / selectedProduct.reviews.length;

  await selectedProduct.save({ validateBeforeSave: false });

  res.status(200).json({
    selectedProduct,
  });
});

export const getProductReview = catchAsyncErrors(async (req, res, next) => {
  const productReview = await product.findById(req.query.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const allReview = productReview.reviews;

  res.status(200).json({
    success: true,
    message: allReview,
  });
});

export const deleteReview = catchAsyncErrors(async (req, res, next) => {
  // const selectedProduct = await product.findById(req.query.productId);

  // if (!selectedProduct) {
  //   return next(new ErrorHandler("Product not found", 404));
  // }

  // let review = selectedProduct.reviews.filter((rev) => {
  //   rev._id.toString() !== req.query.id.toString();
  // });

  const selectedProduct = await product.findById(req.query.productId);

  if (!selectedProduct) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const reviews = selectedProduct.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  console.log(reviews);
  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let rating = 0;

  if (reviews.length === 0) {
    rating = 0;
  } else {
    rating = avg / reviews.length;
  }

  const numOfReviews = reviews.length;

  await product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      rating,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});
