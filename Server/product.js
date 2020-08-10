const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    name: String,
    price: Number,
    stock: Number,
    departaments: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Departament" },
    ],
  },
  { versionKey: false }
);

module.exports = mongoose.model("Product", productSchema);
