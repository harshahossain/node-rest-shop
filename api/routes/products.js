const express = require("express");

const router = express.Router(); //its like a sub-packge express ships with capability of handling different routes

router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "Handling GET requests to /products",
  });
}); //the first arguement is the url we wanna http verb to and here '/' simply translates to /products
//cause we wanna target anything that starts with /products. so anything beyond slash will already have /products built-in
//the second arg is a handler which is a fn

router.post("/", (req, res, next) => {
  res.status(201).json({
    message: "Handling POST requests to /products",
  });
});

router.get("/:productId", (req, res, next) => {
  const id = req.params.productId; //this should be whats after ':' so if we choose ":id" this should and would be req.params.id
  if (id === "special") {
    res.status(200).json({
      message: "Discovered special ID",
      id: id,
    });
  } else {
    res.status(200).json({
      message: `You passed an Id of ${id}`,
    });
  }
}); //tthis : expression means after it we can later extract it

router.patch("/:productID", (req, res, next) => {
  const id = req.params.productID;
  res.status(200).json({
    message: "We hit the PATCH verb for updating product",
  });
});

router.delete("/:productID", (req, res, next) => {
  const id = req.params.productID;
  res.status(200).json({
    message: "We hit the DELETE verb for deleting product",
  });
});

module.exports = router;
