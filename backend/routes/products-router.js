const express = require('express');
const productRouter = express.Router();
// const passport = require('passport');
// const passportConfig = require('../passport');
// const JWT = require('jsonwebtoken');
const product = require('../model/product'); 
// const signToken = productID => {
//     return JWT.sign({
//         iss: "mernauth",
//         sub: productID,
//     }, "mernauthsecret", { expiresIn: "1h" });
// }

/* Api to add Product */
productRouter.post("/add-product",   (req, res) => {
    try {
        if (req.files && req.body && req.body.name && req.body.desc && req.body.price &&
            req.body.discount) {

            let new_product = new product();
            new_product.name = req.body.name;
            new_product.desc = req.body.desc;
            new_product.price = req.body.price;
            new_product.image = req.files[0].filename;
            new_product.discount = req.body.discount;
            new_product.user_id = req.user.id;
            new_product.save((err, data) => {
                if (err) {
                    res.status(400).json({
                        errorMessage: err,
                        status: false
                    });
                } else {
                    res.status(200).json({
                        status: true,
                        title: 'Product Added successfully.'
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

/* Api to update Product */
productRouter.post("/update-product",   (req, res) => {
    try {
        if (req.files && req.body && req.body.name && req.body.desc && req.body.price &&
            req.body.id && req.body.discount) {

            product.findById(req.body.id, (err, new_product) => {

                // if file already exist than remove it
                if (req.files && req.files[0] && req.files[0].filename && new_product.image) {
                    var path = `./uploads/${new_product.image}`;
                    fs.unlinkSync(path);
                }

                if (req.files && req.files[0] && req.files[0].filename) {
                    new_product.image = req.files[0].filename;
                }
                if (req.body.name) {
                    new_product.name = req.body.name;
                }
                if (req.body.desc) {
                    new_product.desc = req.body.desc;
                }
                if (req.body.price) {
                    new_product.price = req.body.price;
                }
                if (req.body.discount) {
                    new_product.discount = req.body.discount;
                }

                new_product.save((err, data) => {
                    if (err) {
                        res.status(400).json({
                            errorMessage: err,
                            status: false
                        });
                    } else {
                        res.status(200).json({
                            status: true,
                            title: 'Product updated.'
                        });
                    }
                });

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

/* Api to delete Product */
productRouter.post("/delete-product", (req, res) => {
    try {
        if (req.body && req.body.id) {
            product.findByIdAndUpdate(req.body.id, { is_delete: true }, { new: true }, (err, data) => {
                if (data.is_delete) {
                    res.status(200).json({
                        status: true,
                        title: 'Product deleted.'
                    });
                } else {
                    res.status(400).json({
                        errorMessage: err,
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

/*Api to get and search product with pagination and search by name*/
productRouter.get("/get-product", (req, res) => {
    try {
        var query = {};
        query["$and"] = [];
        query["$and"].push({
            is_delete: false,
            user_id: req.user.id
        });
        if (req.query && req.query.search) {
            query["$and"].push({
                name: { $regex: req.query.search }
            });
        }
        var perPage = 5;
        var page = req.query.page || 1;
        product.find(query, { date: 1, name: 1, id: 1, desc: 1, price: 1, discount: 1, image: 1 })
            .skip((perPage * page) - perPage).limit(perPage)
            .then((data) => {
                product.find(query).count()
                    .then((count) => {

                        if (data && data.length > 0) {
                            res.status(200).json({
                                status: true,
                                title: 'Product retrived.',
                                products: data,
                                current_page: page,
                                total: count,
                                pages: Math.ceil(count / perPage),
                            });
                        } else {
                            res.status(400).json({
                                errorMessage: 'There is no product!',
                                status: false
                            });
                        }

                    });

            }).catch(err => {
                res.status(400).json({
                    errorMessage: err.message || err,
                    status: false
                });
            });
    } catch (e) {
        res.status(400).json({
            errorMessage: 'Something went wrong!',
            status: false
        });
    }

});

productRouter.post('products/register', (req, res) => {
    const { productname, password } = req.body;
    product.findOne({ productname }, (err, product) => {
        if (err) {
            res.status(500).json({ message: { msgBody: "An error has occurred", msgError: true } });
        }
        if (product) {
            res.status(400).json({ message: { msgBody: "That productname is already taken", msgError: true } });
        } else {
            const newproduct = new product({ productname, password });
            newproduct.save(err => {
                if (err) {
                    res.status(500).json({ message: { msgBody: "An error has occurred", msgError: true } });
                } else {
                    res.status(201).json({ message: { msgBody: "Account successfully created", msgError: false } });
                }
            });
        }
    });
});

// productRouter.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
//     if (req.isAuthenticated()) {
//         const { _id, productname } = req.product;
//         const token = signToken(_id);
//         res.cookie('access_token', token, { httpOnly: true, sameSite: true });
//         res.status(200).json({ isAuthenticated: true, product: { productname } });
//     }
// });

// productRouter.get('/logout', passport.authenticate('jwt', { session: false }), (req, res) => {
//     res.clearCookie('access_token');
//     res.json({ product: { productname: "" }, success: true });
// });

// productRouter.post('/todo', passport.authenticate('jwt', { session: false }), (req, res) => {
//     const todo = new Todo(req.body);
//     todo.save(err => {
//         if (err) {
//             res.status(500).json({ message: { msgBody: "An error has occurred", msgError: true } });
//         } else {
//             req.product.recipes.push(recipe);
//             req.product.save(err => {
//                 if (err) {
//                     res.status(500).json({ message: { msgBody: "An error has occurred", msgError: true } });
//                 } else {
//                     res.status(200).json({ message: { msgBody: "Todo successfully created", msgError: false } });
//                 }
//             });
//         }
//     });
// });

// productRouter.get('/todos', passport.authenticate('jwt', { session: false }), (req, res) => {
//     product.findById({ _id: req.product._id }).populate('recipes').exec((err, document) => {
//         if (err) {
//             res.status(500).json({ message: { msgBody: "An error has occurred", msgError: true } });
//         } else {
//             res.status(200).json({ recipes: document.recipes, authenticated: true });
//         }
//     });
// });

// productRouter.get('/admin', passport.authenticate('jwt', { session: false }), (req, res) => {
//     if (req.product.role === "admin") {
//         res.status(200).json({ message: { msgBody: "You are an admin", msgError: false } });
//     } else {
//         res.status(403).json({ message: { msgBody: "You are NOT an admin", msgError: true } });
//     }
// });

// Maintains login persistence for React...
// productRouter.get('/authenticated', passport.authenticate('jwt', { session: false }), (req, res) => {
//     const { productname } = req.product;
//     res.status(200).json({ isAuthenticated: true, product: { productname } });
// });

module.exports = productRouter;