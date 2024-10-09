/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const env = require("dotenv").config();
const session = require("express-session")
const bodyParser = require("body-parser")
const pool = require('./database/')
const app = express();
const static = require("./routes/static");
const utilities = require("./utilities/index");
const expressLayouts = require("express-ejs-layouts");
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const accountRoute = require('./routes/accountRoute');


/* ***********************
 * Middleware
 * ************************/
 app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}));

app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next();
});

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded


/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout"); // not at views root

/* ***********************
 * Routes
 *************************/
app.use(static);

app.get("/", utilities.handleErrors(baseController.buildHome));

app.use('/inv', utilities.handleErrors(inventoryRoute));

app.use('/account', utilities.handleErrors(accountRoute));

app.use('/error', utilities.handleErrors(utilities.intentionalError));

app.use(async (req, res, next) => {
  next({status: 404, message: 'Looks like that page doesn\'t exist yet!'});
});

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()

  if(err.status == 404) {
    message = err.message
  } else { 
    message = 'Oh no! There was a crash. Maybe try a different page?'
  }
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav,
    errors: null,
  });
});

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT;
const host = process.env.HOST;

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});