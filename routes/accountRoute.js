const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/");
const regValidate = require('../utilities/account-validation')
const accController = require("../controllers/accountController");

router.get('/login', utilities.handleErrors(accController.buildLogin));

router.get('/register', utilities.handleErrors(accController.buildRegistration));
router.post('/register',
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accController.registerAccount),
);


module.exports = router;