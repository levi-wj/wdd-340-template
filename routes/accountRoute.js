const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/");
const accValidate = require('../utilities/account-validation')
const accController = require("../controllers/accountController");

router.get('/login', utilities.handleErrors(accController.buildLogin));
router.post("/login",
  accValidate.loginRules(),
  accValidate.checkLoginData,
  (req, res) => res.status(200).send('login process')
);

router.get('/register', utilities.handleErrors(accController.buildRegistration));
router.post('/register',
  accValidate.registrationRules(),
  accValidate.checkRegData,
  utilities.handleErrors(accController.registerAccount),
);


module.exports = router;