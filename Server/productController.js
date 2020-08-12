const express = require("express");
const router = express.Router();
const Product = require("./product");

router.post("/", (req, res) => {
  const { name, price, stock, departments } = req.body;
  const product = new Product({ name, price, stock, departments });
  product.save((err, prod) => {
    if (err) res.status(500).send(err);
    else res.status(200).send(prod);
  });
});

router.get("/", (req, res) => {
  Product.find().exec((err, prods) => {
    if (err) res.status(500).send(err);
    else res.status(200).send(prods);
  });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  Product.deleteOne({ _id: id }, (err) => {
    if (err) res.status(500).send(err);
    else res.status(200).send({});
  });
});

router.patch("/:id", (req, res) => {
  const { id } = req.params;
  const { name, price, stock, departments } = req.body;
  Product.findById(id, (err, prod) => {
    if (err) {
      res.status(500).send(err);
    } else if (!pro) {
      res.status(404).send({});
    } else {
      prod.name = name;
      prod.price = price;
      prod.stock = stock;
      prod.departments = departments;
      prod.save((err, prod) => {
        if (err) res.status(500).send(err);
        else res.status(200).send(prod);
      });
    }
  });
});

module.exports = router;
