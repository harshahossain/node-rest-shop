//this file spins the express app that makes handling requests easier
const express = require("express");

const app = express();

app.use((req, res, next) => {
  res.status(200).json({
    message: "It Works!",
  }); //this fn is the next, which I use to move the middlewere to next in line
}); //all incoming request goes through this and whatever we pass to it

module.exports = app;
