const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.url = dbConfig.url;
db.profiles = require("./admin/profile.model.js")(mongoose);
db.documents = require("./admin/document.model.js")(mongoose);
db.structures = require("./admin/structure.model.js")(mongoose);
db.extrait = require("./extrait.model")(mongoose);
db.demande = require("./demande.model")(mongoose); 
db.demande = require("./compte.model.js")(mongoose);


 
module.exports = db;
