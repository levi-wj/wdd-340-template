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
  const nav = await utilities.getNav();
  const firstcar = data[0];
  let title = "No vehicles found";

  if (firstcar) {
    title = firstcar.classification_name + " vehicles";
  }

  res.render("./inventory/classification", {
    title,
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

invCont.buildClassificationForm = async function (req, res, next) {
  const nav = await utilities.getNav();
  
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null
  });
}

invCont.createClassification = async function (req, res, next) {
  const { classification_name } = req.body;

  const classification = await invModel.createClassification(classification_name);
  const nav = await utilities.getNav();

  if (classification) {
    req.flash("notice", `You successfully created the '${classification_name}' classification.`);
    res.status(201).render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Error creating classification.");
    res.status(501).render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
    });
  }
}


invCont.buildInventoryForm = async function (req, res, next) {
  const nav = await utilities.getNav();
  const classifications = await invModel.getClassifications() || [];
  
  res.render("./inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    errors: null,
    classifications,
  });
}

invCont.createInventory = async function (req, res, next) {
  const { inv_make,inv_model,inv_year,inv_description,inv_image,inv_thumbnail,inv_price,inv_miles,inv_color,classification_id } = req.body;
  const nav = await utilities.getNav();
  console.log(inv_make,inv_model,inv_year,inv_description,inv_image,inv_thumbnail,inv_price,inv_miles,inv_color)
  const inventory = await invModel.createInventory(inv_make,inv_model,inv_year,inv_description,inv_image,inv_thumbnail,inv_price,inv_miles,inv_color,classification_id);
  const classifications = await invModel.getClassifications() || [];

  if (inventory) {
    req.flash("notice", `You successfully created the '${inv_year} ${inv_make} ${inv_model}' vehicle.`);
    res.status(201).render("./inventory/management", {
      title: "Add Inventory",
      nav,
      errors: null,
      classifications,
    });
  } else {
    req.flash("notice", "Error creating vehicle.");
    res.status(501).render("./inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      errors: null,
      classifications,
    });
  }
}

module.exports = invCont;