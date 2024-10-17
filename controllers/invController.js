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
  const classifications = await invModel.getClassifications() || [];

  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    classifications,
    errors: null,
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
  const existingClass = await invModel.getClassificationByName(classification_name);

  console.log(existingClass)

  // Only create if the classification doesn't already exist
  if (!existingClass) {
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
  } else {
    const nav = await utilities.getNav();

    req.flash("notice", "That classification already exists");
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.JSONGetInventoryByClass = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(classification_id);

  if (invData?.[0]?.inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
}

invCont.buildInvEdit = async (req, res, next) => {
  const inv_id = parseInt(req.params.inv_id);
  const nav = await utilities.getNav();
  const itemData = await invModel.getInventoryById(inv_id);
  const classifications = await invModel.getClassifications() || [];
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;

  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classifications,
    classification_id: itemData.classification_id,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id,
    errors: null,
  });
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;

  const updateResult = await invModel.updateInventory(
    inv_id,inv_make,inv_model,inv_year,inv_description,inv_image,inv_thumbnail,inv_price,inv_miles,inv_color,classification_id
  );

  if (updateResult) {
    const itemName = `${updateResult.inv_make} ${updateResult.inv_model}`;
    req.flash("notice", `The ${itemName} was successfully updated.`);
    res.redirect("/inv/");
  } else {
    const classifications = await invModel.getClassifications() || [];
    const itemName = `${inv_make} ${inv_model}`;

    req.flash("notice", "Something went wrong while trying to update.")
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classifications,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
      errors: null,
    });
  }
}

/* ***************************
 *  Delete confirmation view
 * ************************** */
invCont.deleteConfirmation = async (req, res, next) => {
  const inv_id = parseInt(req.params.inv_id);
  const nav = await utilities.getNav();
  const itemData = await invModel.getInventoryById(inv_id);
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;

  res.render("./inventory/delete-confirm", {
    title: "Confirm delete for " + itemName,
    nav,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
    errors: null,
  });
}

/* ***************************
 *  Delete Inventory Item
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  const nav = await utilities.getNav();
  const { inv_id,inv_make,inv_model,inv_year,inv_price } = req.body;
  const itemName = `${inv_make} ${inv_model}`;

  const deleteResult = await invModel.deleteInventory(inv_id);

  if (deleteResult) {
    req.flash("notice", `The ${itemName} was successfully deleted.`);
    res.redirect("/inv/");
  } else {
    req.flash("notice", "Something went wrong while trying to delete.")
    res.render("./inventory/delete-confirm", {
      title: "Confirm delete for " + itemName,
      nav,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_price,
      errors: null,
    });
  }
}


module.exports = invCont;