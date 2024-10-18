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

/* ***************************
 * Admin Routes Below
 * ************************** */

// When the edit link is clicked from the managemnet page
router.get("/edit/:inv_id",
  utilities.checkAccountAdmin,
  utilities.handleErrors(invController.buildInvEdit))
;
router.post("/update/",
  utilities.checkAccountAdmin,
  invValidate.inventoryRules(),
  invValidate.checkInventoryUpdateData,
  utilities.handleErrors(invController.updateInventory),
);

router.get('/delete/:inv_id',
  utilities.checkAccountAdmin,
  utilities.handleErrors(invController.deleteConfirmation)
);
router.post('/delete/',
  utilities.checkAccountAdmin,
  utilities.handleErrors(invController.deleteInventory)
);

router.get("/add-classification/", 
  utilities.checkAccountAdmin,
  utilities.handleErrors(invController.buildClassificationForm),
);
router.post("/add-classification/", 
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.checkAccountAdmin,
  utilities.handleErrors(invController.createClassification),
);

router.get("/add-inventory/",
  utilities.checkAccountAdmin,
  utilities.handleErrors(invController.buildInventoryForm),
);
router.post("/add-inventory/",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.checkAccountAdmin,
  utilities.handleErrors(invController.createInventory),
);

router.get("/",
  utilities.checkAccountAdmin,
  utilities.handleErrors(invController.buildManagement)
);

module.exports = router;