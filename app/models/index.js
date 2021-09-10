//initialize mongoose


const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

//If we want to use mongoose in different position inside the codes it must be viewed
// as global mode, that's why we need to set mongoose as mongoose.promise 

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.role = require("./role.model");

db.ROLES = ["user", "admin"];

module.exports = db ;