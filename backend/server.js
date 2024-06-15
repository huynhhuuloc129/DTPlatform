var express = require("express");
var app = express();

const dotenv = require('dotenv');


const env = dotenv.config().parsed;


const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var cors = require('cors');
var multer = require('multer'),
  bodyParser = require('body-parser'),
  path = require('path');

const db = require('./db'); 

var fs = require('fs');
// var product = require("./model/product.js");
const productsRouter = require('./routes/products-router');
const usersRouter = require('./routes/users-router');
const roadsRouter = require('./routes/roads-router.js');  
const csvRouter = require("./routes/csv-router.js");
// var road = require("./model/road.js");
// var lecturer = require("./model/lecturer.js");
// var user = require("./model/user.js");

app.use(cors());
app.use(express.static('uploads'));
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: false
}));


db.on('error', console.error.bind(console, 'MongoDB connection error.'));

app.use("/", (req, res, next) => {
  try {
    if (req.path == "/user/login" || req.path == "/user/register" || req.path == "/") {
      next();
    } else {
      /* decode jwt token if authorized*/
      jwt.verify(req.headers.token, 'shhhhh11111', function (err, decoded) {
        if (decoded && decoded.user) {
          req.user = decoded;
          next();
        } else {
          return res.status(401).json({
            errorMessage: 'User unauthorized!',
            status: false
          });
        }
      })
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }
})

app.get("/", (req, res) => {
  res.status(200).json({
    status: true,
    title: 'Apis'
  });
});

app.use('/user', usersRouter);
app.use('/product', productsRouter);
app.use('/road', roadsRouter);
app.use('/csv',csvRouter)

app.listen(2000, () => {
  console.log("Server is Runing On port 2000");
});
