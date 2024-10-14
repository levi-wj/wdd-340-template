const invModel = require("../models/inventory-model");
const jwt = require("jsonwebtoken");
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = '<ul class="flex justify-around">';

  list += '<li><a href="/" title="Home page" class="no-underline">Home</a></li>';
  data.forEach((row) => {
    list += `
    <li>
      <a href="/inv/type/${row.classification_id}" class="no-underline"	" title="See our inventory of ${row.classification_name} vehicles">
        ${row.classification_name}
      </a>
    </li>`;
  });
  list += '</ul>';

  return list;
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid = '';

  if (data.length > 0) {
    grid += '<ul id="inv-display">';
    data.forEach(vehicle => {
      grid += '<li>';
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id
        + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
        + ' details"><img src="' + vehicle.inv_thumbnail 
        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
        +' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += '<hr />';
      grid += '<h2>';
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>';
      grid += '</h2>';
      grid += '<span>$' 
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>';
      grid += '</div>';
      grid += '</li>';
    });
    grid += '</ul>';
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }

  return grid;
}

Util.intentionalError = function (req, res, next) {
  throw new Error('This is an intentional error for testing purposes');
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = function(cb) {
  return (req, res, next) => Promise.resolve(cb(req, res, next)).catch(next);
}

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
 if (req.cookies.jwt) {
  jwt.verify(
   req.cookies.jwt,
   process.env.ACCESS_TOKEN_SECRET,
   (err, accountData) => {
    if (err) {
     res.clearCookie("jwt");
     req.flash("Please log in");
     return res.redirect("/account/login");
    }
    res.locals.accountData = accountData;
    res.locals.loggedin = 1;
    next();
   });
 } else {
  next();
 }
}

/* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next();
  } else {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }
 }

module.exports = Util;
