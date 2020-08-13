const express = require("express");
const router = express.Router();
const Departament = require("./departament");
const Product = require("./product");

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

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const prods = await Product.find({ departaments: id }).exec();
    console.log(prods);
    if (prods.length > 0) {
      res.status(500).send({
        msg: "Could not remove this department",
      });
    } else {
      await Departament.deleteOne({ _id: id });
      res.status(200).send({});
    }
    // Departament.deleteOne({ _id: id }, (err) => {
    //   if (err) res.status(500).send(err);
    //   else res.status(200).send({});
    // });
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Internal Error" }, error);
  }
});

router.patch("/:id", (req, res) => {
  const { id } = req.params;
  Departament.findById(id, (err, dep) => {
    if (err) {
      res.status(500).send(err);
    } else if (!dep) {
      res.status(400).send({});
    } else {
      const { name } = req.body;
      dep.name = name;
      dep
        .save()
        .then((dep) => res.status(200).send(dep))
        .catch((err) => res.status(500).send(err));
    }
  });
});

module.exports = router;
