const utilities = require('../utilities');
const accountModel = require('../models/account-model');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  });
}


/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegistration(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register Account",
    nav,
    errors: null,
  });
}

async function buildUpdate(req, res, next) {
  const nav = await utilities.getNav();
  const accountData = res.locals.accountData;

  res.render('account/update', {
    title: 'Update Account Information',
    nav,
    errors: null,
    account_id: accountData.account_id,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
  });
}


/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_password } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.');
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword,
  );

  if (regResult) {
    req.flash("notice", `Congratulations, you\'re registered ${account_firstname}. Please log in.`);
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
 let nav = await utilities.getNav();
 const { account_email, account_password } = req.body;
 const accountData = await accountModel.getAccountByEmail(account_email);

 if (!accountData) {
  req.flash("notice", "Please check your credentials and try again.")
  res.status(400).render("account/login", {
   title: "Login",
   nav,
   errors: null,
   account_email,
  });
  return;
 }

 try {
  if (await bcrypt.compare(account_password, accountData.account_password)) {
    delete accountData.account_password;
    const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 });

    if (process.env.NODE_ENV === 'development') {
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
    } else {
      res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 });
    }
    return res.redirect("/account/");
  }
 } catch (error) {
  return new Error('Access Forbidden');
 }
}

async function buildAccount(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/account-management", {
    title: "Account",
    nav,
    errors: null,
  });
}

async function updateAccountInfo(req, res, next) {
  const nav = await utilities.getNav();
  const { account_id, account_firstname, account_lastname, account_email, } = req.body;
  
  const accountData = await accountModel.updateAccountInfo(account_id, account_firstname, account_lastname, account_email);

  if (accountData) {
    req.flash("notice", "Account information updated.");
    res.render("account/update", {
      title: "Update Account Information",
      nav,
      errors: null,
      account_id: accountData.account_id,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email,
    });
  } else {
    req.flash("notice", "Error updating account information.");
    res.status(501).render("account/update", {
      title: "Update Account Information",
      nav,
      errors: null,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
    });
  }
}

async function updateAccountPassword(req, res, next) {
  const nav = await utilities.getNav();
  const { account_id, account_password } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the update.');
    res.render('account/update', {
      title: 'Update Account Information',
      nav,
      errors: null,
      account_id: accountData.account_id,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email,
    });
  }

  const accountData = await accountModel.updateAccountPassword(account_id, hashedPassword);

  if (accountData) {
    req.flash("notice", "Password updated.");
    res.render("account/update", {
      title: "Update Account Information",
      nav,
      errors: null,
      account_id: accountData.account_id,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email,
    });
  } else {
    const accountData = res.locals.accountData;

    req.flash("notice", 'Sorry, there was an error processing the update.');
    res.render('account/update', {
      title: 'Update Account Information',
      nav,
      errors: null,
      account_id: accountData.account_id,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email,
    });
  }
}

async function logout(req, res, next) {
  res.clearCookie("jwt");
  req.flash("notice", "You have been logged out.");
  res.redirect("/account/login");
}


module.exports = {
  buildLogin,
  buildRegistration,
  buildUpdate,
  registerAccount,
  buildAccount,
  accountLogin,
  updateAccountInfo,
  updateAccountPassword,
  logout,
};