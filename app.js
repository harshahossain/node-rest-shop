//this file spins the express app that makes handling requests easier
//we are getting morgan for keeping tabs on the requests//basically login package for nodejs
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser"); //for catcing body of a req. doesnt work on file. but works for json. urlEncoded
const mongoose = require("mongoose");

const app = express();

mongoose.connect(
  "mongodb+srv://mharshapratham:" +
    process.env.MONGO_ATLAS_PW +
    "@node-rest-shop.3p5ml8m.mongodb.net/?retryWrites=true&w=majority"
  // {
  //   useMongoClient: true, //this is dated and crashes the app
  // }
);

app.use("/uploads", express.static("uploads")); //multer//to access it we just need to localhost:3000/fileNameInUploadsFolder.jpeg
//but I added 'uploads' so now its localhost:3000/uploads/thenWhateverTheFileNameIs.jepg
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");

//for enabling cross origin resource sharing CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); //neccessary for accessing from different client| * means any and all
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  ); //what type of headers are we accepting | can also just * the 2nd args
  if (req.method === "OPTIONS") {
    //for post/ put request since the browser sends this. so we tell the browser what we may send
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, PATCH, DELETE");
    return res.status(200).json({}); //by sending back a res we just telling the browser/client what are we accepting
  }
  next(); //without calling next other routes wont take over.without it we would block all our incoming request since it wont pass untill next()
});

// app.use((req, res, next) => {
//   res.status(200).json({
//     message: "It Works!",
//   }); //this fn is the next, which I use to move the middlewere to next in line
// }); //all incoming request goes through this and whatever we pass to it

//routes
app.use("/products", productRoutes); //so this prefixes the call with '/products' and this is why in products.js we only gonna use '/'

app.use("/orders", orderRoutes);

//catching everything that cant get to upper routes
//handling error
app.use((req, res, next) => {
  const error = new Error("not found");
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
