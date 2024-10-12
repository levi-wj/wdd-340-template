const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;

  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    errors: null,
  });
}

/* ***************************
 *  Show one specific car
 * ************************** */
invCont.buildInvDetail = async function (req, res, next) {
  const invId = req.params.invId;
  const item = await invModel.getInventoryById(invId);
  let nav = await utilities.getNav();

  if (item) {
    const title = `${item.inv_make} ${item.inv_model}`;

    res.render("./inventory/detail", { 
      title, 
      nav, 
      item,
      errors: null,
     });
  } else {
    res.render('./errors/error', {
      message: 'Vehicle not found', 
      title: 'Not Found', 
      nav,
      errors: null,
    });
  }
}

invCont.buildManagement = async function (req, res, next) {
  const nav = await utilities.getNav();
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    errors: null
  });
}

module.exports = invCont