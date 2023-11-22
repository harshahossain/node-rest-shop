//this file spins the express app that makes handling requests easier
const express = require("express");

const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");

const app = express();

// app.use((req, res, next) => {
//   res.status(200).json({
//     message: "It Works!",
//   }); //this fn is the next, which I use to move the middlewere to next in line
// }); //all incoming request goes through this and whatever we pass to it

app.use("/products", productRoutes); //so this prefixes the call with '/products' and this is why in products.js we only gonna use '/'

app.use("/orders", orderRoutes);

module.exports = app;
