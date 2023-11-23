const express = require("express");
const mongoose = require("mongoose");
const router = express.Router(); //its like a sub-packge express ships with capability of handling different routes
const multer = require("multer");
//const upload = multer({ dest: "uploads/" });

//more multer config (neccsarry? eh)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    const name = Date.now();
    cb(null, name + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    "image/webp" ||
    "image/jpg" ||
    "image/png"
  ) {
    //accept
    cb(null, true);
  } else {
    //reject a file
    cb(null, false);
  }
};
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10,
  },
  fileFilter: fileFilter,
});

//importing mongoose Model
const Product = require("../models/product");

//GET_ALL
router.get("/", (req, res, next) => {
  Product.find()
    .select("name price _id productImage")
    .exec()
    .then((doc) => {
      const response = {
        count: doc.length,
        //products: doc,
        products: doc.map((data) => {
          return {
            name: data.name,
            price: data.price,
            productImage: data.productImage,
            _id: data._id,
            url: {
              request: {
                type: "GET",
                url: "http://localhost:3000/products/" + data._id,
              },
            },
          };
        }),
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
}); //the first arguement is the url we wanna http verb to and here '/' simply translates to /products
//cause we wanna target anything that starts with /products. so anything beyond slash will already have /products built-in
//the second arg is a handler which is a fn

//POST
router.post("/", upload.single("productImage"), (req, res, next) => {
  console.log(req.file);
  const product = new Product({
    //setting up the product with mongoose
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path,
  });
  product
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Product created [POST verb]",
        //createdProduct: result,
        createdProduct: {
          name: result.name,
          price: result.price,
          _id: result._id,
          request: {
            type: "GET",
            url: "http://localhost:3000/products/" + result._id,
          },
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    }); //exec()
  //neccessary|method provied by mongoose to store into database
});

//GET SINGLE PRODUCT
router.get("/:productId", (req, res, next) => {
  const id = req.params.productId; //this should be whats after ':' so if we choose ":id" this should and would be req.params.id
  Product.findById(id)
    .select("name price _id productImage")
    .exec()
    .then((doc) => {
      console.log("from database", doc);
      if (doc) {
        res.status(200).json({
          product: doc,
          request: {
            type: "GET",
            description: "GET_ALL_PRODUCTS",
            ulr: "http://localhost:3000/products",
          },
        });
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
      res.status(200).json({
        message: "Product Updated",
        request: {
          type: "GET",
          description: "GET_THIS_PRODUCT",
          url: "http://localhost:3000/products/" + id,
        },
      });
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
      res.status(200).json({
        message: "Product Deleted",
        request: {
          type: "POST",
          description: "CREATE_PRODUCT",
          url: "http://localhost:3000/products/",
          body: { name: "String", price: "Number" },
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

module.exports = router;
