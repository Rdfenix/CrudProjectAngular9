const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const departamentController = require("./departamentController");
const productController = require("./productController");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

mongoose.connect(
  "mongodb+srv://rdfenix:@Aiolos92@rudfenix.huk8u.mongodb.net/RudFenix?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

app.use("/departments", departamentController);
app.use("/products", productController);

app.listen(3000, () => {
  console.log("RUNNING");
});
