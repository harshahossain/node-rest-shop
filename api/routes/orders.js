const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "hitting the GET for orders. So, orders fetched, I guess",
  });
});

router.post("/", (req, res, next) => {
  res.status(201).json({
    //201 means 'everything was successful resourse created'
    message: "hitting the POST for orders. So, order created, I guess",
  });
});

router.get("/:orderId", (req, res, next) => {
  res.status(200).json({
    message: "sending back some order details[GET VERB]",
    orderId: req.params.orderId,
  });
});

router.delete("/:orderId", (req, res, next) => {
  res.status(200).json({
    message: "order deleted [DELETE VERB]",
    orderId: req.params.orderId,
  });
});

module.exports = router;
