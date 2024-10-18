const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/");
const accValidate = require('../utilities/account-validation')
const accController = require("../controllers/accountController");

router.get('/login', utilities.handleErrors(accController.buildLogin));
router.post("/login",
  accValidate.loginRules(),
  accValidate.checkLoginData,
  utilities.handleErrors(accController.accountLogin),
);

router.get('/logout', utilities.handleErrors(accController.logout));

router.get('/register', utilities.handleErrors(accController.buildRegistration));
router.post('/register',
  accValidate.registrationRules(),
  accValidate.checkRegData,
  utilities.handleErrors(accController.registerAccount),
);

router.get('/update', utilities.handleErrors(accController.buildUpdate));
router.post('/update',
  accValidate.updateRules(),
  accValidate.checkUpdateData,
  utilities.handleErrors(accController.updateAccountInfo)
);
router.post('/update-password',
  accValidate.passwordRules(),
  accValidate.checkPasswordData,
  utilities.handleErrors(accController.updateAccountPassword)
);

// Serve the account-management page
router.get('/',
  utilities.checkLogin,
  utilities.handleErrors(accController.buildAccount),
);


module.exports = router;