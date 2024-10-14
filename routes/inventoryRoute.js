// Needed Resources 
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/");
const invController = require("../controllers/invController");
const invValidate = require("../utilities/inv-validation");

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

router.get("/detail/:invId", utilities.handleErrors(invController.buildInvDetail));

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.JSONGetInventoryByClass));

// When the edit link is clicked from the managemnet page
router.get("/edit/:inv_id", utilities.handleErrors(invController.buildInvEdit));
router.post("/update/",
  invValidate.inventoryRules(),
  invValidate.checkInventoryUpdateData,
  utilities.handleErrors(invController.updateInventory),
);

router.get("/add-classification/", utilities.handleErrors(invController.buildClassificationForm));
router.post("/add-classification/", 
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.createClassification)
);

router.get("/add-inventory/", utilities.handleErrors(invController.buildInventoryForm));
router.post("/add-inventory/",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.createInventory)
);

router.get("/", utilities.handleErrors(invController.buildManagement));

module.exports = router;