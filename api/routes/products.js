const express = require("express");
const mongoose = require("mongoose");
const router = express.Router(); //its like a sub-packge express ships with capability of handling different routes

//importing mongoose Model
const Product = require("../models/product");

router.get("/", (req, res, next) => {
  Product.find()
    .exec()
    .then((doc) => {
      console.log(doc);
      res.status(200).json(doc);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
}); //the first arguement is the url we wanna http verb to and here '/' simply translates to /products
//cause we wanna target anything that starts with /products. so anything beyond slash will already have /products built-in
//the second arg is a handler which is a fn

router.post("/", (req, res, next) => {
  const product = new Product({
    //setting up the product with mongoose
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
  });
  product
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Handling POST requests to /products",
        createdProduct: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    }); //exec()
  //neccessary|method provied by mongoose to store into database
});

router.get("/:productId", (req, res, next) => {
  const id = req.params.productId; //this should be whats after ':' so if we choose ":id" this should and would be req.params.id
  Product.findById(id)
    .exec()
    .then((doc) => {
      console.log("from database", doc);
      if (doc) {
        res.status(200).json(doc);
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
}); //tthis : expression means after it we can later extract it

router.patch("/:productId", (req, res, next) => {
  const id = req.params.productId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.updateOne({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.delete("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.deleteMany({ _id: id })
    .exec()
    .then((result) => {
      console.log("deleted id given via params", result);
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

module.exports = router;
