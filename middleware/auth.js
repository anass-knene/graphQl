const isAuth = (req, res, next) => {
  // console.log("====================================");
  console.log(req);
  // console.log("====================================");
  if (req.session.isAuthenticated) {
    next();
  } else {
    res.status(401).send({ success: false, message: "Authentication failed" });
  }
};
module.exports = isAuth;
