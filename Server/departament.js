const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const departamentSchema = new Schema(
  {
    name: String,
  },
  { versionKey: false }
);

module.exports = mongoose.model("Departament", departamentSchema);
