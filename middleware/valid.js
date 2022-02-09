const { body, validationResult } = require("express-validator");
const userCollection = require("../models/userSchema");

let validator = [
  body("username")
    .isLength({ min: 5, max: 50 })
    .withMessage(
      "Please fill your username and should be at least 5 characters and not more than 50 characters"
    )
    .trim(),

  body("email")
    .isEmail()
    .withMessage("Please fill your email address")
    .trim()
    .toLowerCase()
    .custom((value) => {
      return userCollection.findOne({ email: value }).then((userEmail) => {
        if (userEmail) {
          return Promise.reject("that email address is already in use");
        }
        return true;
      });
    }),
  body("password", "please dont use common words as passwords")
    .not()
    .isIn(["1234", "abcd", "hello"])
    .customSanitizer((value) => {
      return value;
    }),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      next();
    } else {
      let message = errors.array().reduce((acc, item) => {
        acc[item.param] = item.msg;
        return acc;
      }, {});

      res.json({ status: 401, message: message });
    }
  },
];

module.exports = validator;
