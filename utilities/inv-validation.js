const utilities = require(".");
const invModel = require("../models/inventory-model");
const { body, validationResult } = require("express-validator");
const validate = {};

/*  **********************************
*  Classification Data Validation Rules
* ********************************* */
validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .notEmpty()
      .isAlpha()
      .isLength({ min: 1 })
      .withMessage("Please provide a valid classification name"), // on error this message is sent.
  ];
}

validate.inventoryRules = () => {
  return [
    body('inv_make')
      .trim()
      .notEmpty()
      .withMessage('Please provide a valid make'),

    body('inv_model')
      .trim()
      .notEmpty()
      .withMessage('Please provide a valid model'),

    body('inv_year')
      .trim()
      .notEmpty()
      .isNumeric()
      .withMessage('Please provide a valid year'),

    body('inv_description')
      .trim()
      .notEmpty()
      .withMessage('Please provide a valid description'),

    body('inv_image')
      .trim()
      .notEmpty()
      .withMessage('Please provide a valid image URL'),

    body('inv_thumbnail')
      .trim()
      .notEmpty()
      .withMessage('Please provide a valid thumbnail URL'),

    body('inv_price')
      .trim()
      .notEmpty()
      .isNumeric()
      .withMessage('Please provide a valid price'),

    body('inv_miles')
      .trim()
      .notEmpty()
      .isNumeric()
      .withMessage('Please provide a valid miles'),

    body('inv_color')
      .trim()
      .notEmpty()
      .withMessage('Please provide a valid color'),
  ];
}


/* ******************************
 * Check data and return errors for adding classification
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("./inventory/add-classification", {
      errors,
      title: "Add Classification",
      nav,
      classification_name,
    });
    return;
  }
  next();
}

validate.checkInventoryData = async (req, res, next) => {
  const { inv_make,inv_model,inv_year,inv_description,inv_image,inv_thumbnail,inv_price,inv_miles,inv_color,classification_id  } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const classifications = await invModel.getClassifications() || [];
    res.render("./inventory/add-inventory", {
      errors,
      title: "Add Inventory",
      nav,
      inv_make,inv_model,inv_year,inv_description,inv_image,inv_thumbnail,inv_price,inv_miles,inv_color,classification_id,
      classifications,
    });
    return;
  }
  next();
}

/* ******************************
 * Check data and return errors for updating classification
 * ***************************** */
validate.checkInventoryUpdateData = async (req, res, next) => {
  const { inv_id,inv_make,inv_model,inv_year,inv_description,inv_image,inv_thumbnail,inv_price,inv_miles,inv_color,classification_id  } = req.body;
  const errors = validationResult(req);
  const itemName = `${inv_make} ${inv_model}`;

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const classifications = await invModel.getClassifications() || [];
    res.render("./inventory/edit-inventory", {
      errors,
      title: "Edit " + itemName,
      nav,
      inv_id,inv_make,inv_model,inv_year,inv_description,inv_image,inv_thumbnail,inv_price,inv_miles,inv_color,classification_id,
      classifications,
    });
    return;
  }
  next();
}

module.exports = validate;