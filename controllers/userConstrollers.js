import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import { User } from "../models/userModel.js";
import { ErrorHandler } from "../utils/ErrorHandler.js";
import { sendToken } from "../utils/sendToken.js";

export const registerUser = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.body;

  let user = await User.findOne({ email });

  user = await User.create(req.body);

  sendToken(user, 200, res);
});

export const loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  let user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("User doesn't exist", 404));
  }

  const isCorrectPassword = await user.comparePassword(password);

  if (!isCorrectPassword) {
    return next(new ErrorHandler("Invalid email or password", 404));
  }

  sendToken(user, 200, res);
});

export const logoutUser = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", null, {
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Logged Out Successfully",
    });
});

export const forgotPassword = catchAsyncErrors(async (req, res) => {});
//   const { email } = req.body;

//   let user = await User.findOne({ email });

//   if (!user) {
//     return res
//       .status(404)
//       .json({ success: false, message: "User DOesnt Exist" });
//   }

//   const resetToken = user.getResetToken();

//   await user.save({ validateBeforeSave: false });

//   const resetPasswordUrl = `${req.protocol}://${req.get(
//     "host"
//   )}/password/reset/${resetToken}`;

//   const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

//   try {
//     await sendEmail({
//       email: user.email,
//       subject: `Ecommerce Password Recovery`,
//       message,
//     });

//     res.status(200).json({
//       success: true,
//       message: `Email sent to ${user.email} successfully`,
//     });
//   } catch (error) {
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpire = undefined;

//     await user.save({ validateBeforeSave: false });

//     return next(new ErrorHander(error.message, 500));
//   }
// });

export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
  let user = await User.findById(req.user.id);

  res.status(200).json({ success: true, message: user });
});

export const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isCorrectPassword = await user.comparePassword(req.body.oldPassword);

  if (!isCorrectPassword) {
    return next(new ErrorHandler("Incorrect Password", 404));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password didn't match", 404));
  }

  user.password = req.body.newPassword;

  await user.save();

  sendToken(user, 200, res);
});

export const updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: true,
  });

  res.status(200).json({
    success: true,
    message: user,
  });
});

// admin route
export const allUsers = catchAsyncErrors(async (req, res, next) => {
  let users = await User.find();

  res.status(200).json({
    success: true,
    message: users,
  });
});

export const singleUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler("User does not exist with this id", 404));
  }

  res.status(200).json({
    success: true,
    message: user,
  });
});

export const updateRole = catchAsyncErrors(async (req, res, next) => {
  const updateRole = {
    role: req.body.role,
  };

  let user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler("User Not Found can't update", 404));
  }

  user = await User.findByIdAndUpdate(req.params.id, updateRole, {
    new: true,
    runValidators: true,
    useFindAndModify: true,
  });

  res.status(200).json({
    success: true,
    message: user,
  });
});

export const deleteUser = catchAsyncErrors(async (req, res, next) => {
  let user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler("User Not Found can't delete user", 404));
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: user,
  });
});
