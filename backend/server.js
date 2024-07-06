const express = require("express");
require('@babel/register')({
  presets: ['@babel/preset-env', '@babel/preset-react']
});
const app = express();
const cors = require('cors');
const logger = require("morgan");

const PORT = process.env.PORT || 4002; 
app.use(cors());

const db = require("./models");

const bodyParser=require("body-parser");
app.use(bodyParser.json());  
app.use(bodyParser.urlencoded({extended:true})); 

//recuper tous les api 
const route =require("./routes/app.routes")
app.use("/api",route)

db.mongoose
  .connect(db.url)  
  .then(() => {
    console.log(`Connected to the database '${db.url}' !`);
  })
  .catch(err => {
    console.log(`Cannot connect to the database '${db.url}' !`, err);
    process.exit();
  });
  
app.use(logger("dev")); 




app.get("/", (req, res) => {
  res.json({ message: "Welcome to plateforme ." });
});

app.listen(PORT, () => {
  console.log(`Backend express server is running on port ${PORT}.`);
});
