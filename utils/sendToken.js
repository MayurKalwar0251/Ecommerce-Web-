export const sendToken = (user, statusCode, res) => {
  const token = user.getJWTToken();

  const options = {
    httpOnly: true,
    expires: new Date(Date.now() + 25 * 60 * 1000),
  };

  res.status(200).cookie("token", token, options).json({
    success: true,
    user,
    token,
  });
};
