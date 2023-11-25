//
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" "[1]).toString();
    //const token = req.headers.authorization;
    const decoded = jwt.verify(token, process.env.JWT_KEY); //req.body.token?
    req.userData = decoded;
    next(); //if we authenticate. so, it goes over to next args
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      message: "Auth Failed",
    });
  }
};
