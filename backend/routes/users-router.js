const express = require('express');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const userRouter = express.Router();
// const passport = require('passport');
// const passportConfig = require('../passport');
// const JWT = require('jsonwebtoken');
const user = require('../model/user');
// const signToken = userID => {
//     return JWT.sign({
//         iss: "mernauth",
//         sub: userID,
//     }, "mernauthsecret", { expiresIn: "1h" });
// }


/* login api */
userRouter.post("/login", (req, res) => {
    try {
        if (req.body && req.body.username && req.body.password) {
            user.find({ username: req.body.username }).then((data) => {
                if (data.length > 0) {

                    if (bcrypt.compareSync(data[0].password, req.body.password)) {
                        checkUserAndGenerateToken(data[0], req, res);
                    } else {

                        res.status(400).json({
                            errorMessage: 'Username or password is incorrect!',
                            status: false
                        });
                    }


                } else {
                    res.status(400).json({
                        errorMessage: 'Username or password is incorrect!',
                        status: false
                    });
                }
            });
        } else {
            res.status(400).json({
                errorMessage: 'Add proper parameter first!',
                status: false
            });
        }
    } catch (e) {
        console.log(e);
        res.status(400).json({
            errorMessage: 'Something went wrong!',
            status: false
        });
    }

});

/* register api */
userRouter.post("/register", (req, res) => {
    try {
        if (req.body && req.body.username && req.body.password) {

            user.find({ username: req.body.username }).then((data) => {

                if (data.length == 0) {

                    let User = new user({
                        username: req.body.username,
                        password: req.body.password
                    });
                    User.save().then(() => {
                        res.status(200).json({
                            status: true,
                            title: 'Registered Successfully.'
                        });
                    }).catch((err) => {
                        // console.log(err);
                        res.status(400).json({
                            errorMessage: err.message || err,
                            status: false
                        });
                    });

                } else {
                    // console.log(`UserName ${req.body.username} Already Exist!`);
                    res.status(400).json({
                        errorMessage: `UserName ${req.body.username} Already Exist!`,
                        status: false
                    });
                }

            });

        } else {
            res.status(400).json({
                errorMessage: 'Add proper parameter first!',
                status: false
            });
        }
    } catch (e) {
        res.status(400).json({
            errorMessage: 'Something went wrong!',
            status: false
        });
    }
});

function checkUserAndGenerateToken(data, req, res) {
    jwt.sign({ user: data.username, id: data._id }, 'shhhhh11111', { expiresIn: '1d' }, (err, token) => {
        if (err) {
            res.status(400).json({
                status: false,
                errorMessage: err,
            });
        } else {
            res.json({
                message: 'Login Successfully.',
                token: token,
                status: true
            });
        }
    });
}

userRouter.get("/", (req, res) => {
    user.find()
      .then((data) => {
  
        // console.log(data);
        if (data) {
          res.status(200).json({
            status: true,
            title: 'Users retrived.',
            users: data
          });
        } else {
          res.status(400).json({
            errorMessage: 'There is no user!',
            status: false
          });
        }
  
      }).catch(err => {
        res.status(400).json({
          errorMessage: err.message || err,
          status: false
        });
      });
  
  });

module.exports = userRouter;