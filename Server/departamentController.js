const express = require("express");
const router = express.Router();
const Departament = require("./departament");

router.post("/", (req, res) => {
  let departament = new Departament({ name: req.body.name });
  departament.save((err, dep) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(dep);
    }
  });
});

router.get("/", (req, res) => {
  Departament.find().exec((err, deps) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(deps);
    }
  });
});

router.delete("/:id", (req, res) => {
  const { id } = req?.params;
  Departament.deleteOne({ _id: id }, (err) => {
    if (err) res.status(500).send(err);
    else res.status(200).send({});
  });
});

module.exports = router;
