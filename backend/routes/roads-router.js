const express = require('express');
const roadRouter = express.Router();
// const passport = require('passport');
// const passportConfig = require('../passport');
// const JWT = require('jsonwebtoken');
const road = require('../model/road');
// const signToken = roadID => {
//     return JWT.sign({
//         iss: "mernauth",
//         sub: roadID,
//     }, "mernauthsecret", { expiresIn: "1h" });
// }

var multer = require('multer'),
    bodyParser = require('body-parser'),
    path = require('path');
var dir = './uploads';
var upload = multer({
    storage: multer.diskStorage({

        destination: function (req, file, callback) {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            callback(null, './uploads');
        },
        filename: function (req, file, callback) { callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); }

    }),

    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname)
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
            return callback(/*res.end('Only images are allowed')*/ null, false)
        }
        callback(null, true)
    }
});

/* road api */

// /* Api to add Lecturer */
// roadRouter.post("/add-road", upload.any(), (req, res) => {
//     try {
//         if (req.body && req.body.name && req.body.desc && req.body.mscb) {
//             let new_road = new road();
//             new_road.name = req.body.name;
//             new_road.desc = req.body.desc;
//             new_road.mscb = req.body.mscb;
//             new_road.image = req.body.file;
//             new_road.save().then(() => {
//                 res.status(200).json({
//                     status: true,
//                     title: 'Lecturer Added successfully.'
//                 });
//             }).catch((err) => {
//                 res.status(400).json({
//                     errorMessage: err.message || err,
//                     status: false
//                 });
//             });

//         } else {
//             res.status(400).json({
//                 errorMessage: 'Add proper parameter first!',
//                 status: false
//             });
//         }
//     } catch (e) {
//         res.status(400).json({
//             errorMessage: 'Something went wrong!',
//             status: false
//         });
//     }
// });

/*Api to get road*/
roadRouter.get("/get-road", (req, res) => {
    road.find()
      .then((data) => {
  
        // console.log(data);
        if (data) {
          res.status(200).json({
            status: true,
            title: 'ROAD retrived.',
            roads: data
          });
        } else {
          res.status(400).json({
            errorMessage: 'There is no road!',
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
  
  /*Api to get road inside boundary*/
  roadRouter.get("/get-road-inside", (req, res) => {
    var query = {};
    query["$and"] = [];
    let x1 = 105.83365758174284;
    let y1 = 21.024622888117804;
    let x2 = 105.86073716395765;
    let y2 = 21.040597161724193;
    if (req.query && req.query.search) {
      query["$and"].push({ coordinates: { $geoWithin: { $geometry: req.query.search } } });
      let p = req.query.search.split(",");
      x1 = parseFloat(p[0]);
      y1 = parseFloat(p[1]);
      x2 = parseFloat(p[2]);
      y2 = parseFloat(p[3]);
    }
    road.find({
      geometry: {
        $geoWithin: {
          $geometry: {
            type: "Polygon",
            coordinates: [[[x1, y1], [x1, y2], [x2, y2], [x2, y1], [x1, y1]]]
          }
        }
      }
    })
      .then((data) => {
  
        // console.log(data);
        if (data) {
          res.status(200).json({
            status: true,
            title: 'ROAD retrived.',
            roads: data
          });
        } else {
          res.status(400).json({
            errorMessage: 'There is no road!',
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
  
  /*Api to get road nearest to point*/
  roadRouter.get("/get-road-near", (req, res) => {
    // var query = {};
    // query["$and"] = [];
    let x1 = 105.83365758174284;
    let y1 = 21.024622888117804;
    let minD = 1;
    let maxD = 5;
    if (req.query && req.query.search) {
      // query["$and"].push({ coordinates: { $geoWithin: { $geometry: req.query.search } } });
      let p = req.query.search.split(",");
      x1 = parseFloat(p[0]);
      y1 = parseFloat(p[1]);
      minD = parseFloat(p[2]);
      maxD = parseFloat(p[3]);
  
      // console.log(x1 + " " + y1);
    }
  
    road.find(
      {
        geometry:
        {
          $nearSphere: {
            $geometry: {
              type: "Point",
              coordinates: [x1, y1]
            },
            $minDistance: minD,
            $maxDistance: maxD
          }
        }
      }
    )
      .then((data) => {
  
        // console.log(data);
        if (data) {
          res.status(200).json({
            status: true,
            title: 'ROAD retrived.',
            roads: data
          });
        } else {
          res.status(400).json({
            errorMessage: 'There is no road!',
            status: false
          });
        }
  
      }).catch(err => {
  
        console.log(err);
        res.status(400).json({
          errorMessage: err.message || err,
          status: false
        });
      });
  
  });
  
/* Api to update Lecturer */
// roadRouter.post("/update-road", upload.any(), (req, res) => {
//     try {
//         if (req.body && req.body.name && req.body.desc && req.body.mscb) {

//             road.findOne({mscb:req.body.mscb}).then( (new_road) => {


//                 if (req.body.file) {
//                     new_road.image = req.body.file;
//                 }
//                 if (req.body.name) {
//                     new_road.name = req.body.name;
//                 }
//                 if (req.body.desc) {
//                     new_road.desc = req.body.desc;
//                 }
//                 if (req.body.mscb) {
//                     new_road.mscb = req.body.mscb;
//                 }

//                 new_road.save().then(() => {
//                     res.status(200).json({
//                         status: true,
//                         title: 'Lecturer updated.'
//                     });
//                 }).catch((err) => {
//                     res.status(400).json({
//                         errorMessage: err.message || err,
//                         status: false
//                     });
//                 });

//             });

//         } else {
//             res.status(400).json({
//                 errorMessage: 'Add proper parameter first!',
//                 status: false
//             });
//         }
//     } catch (e) {
//         res.status(400).json({
//             errorMessage: 'Something went wrong! '+e,
//             status: false
//         });
//     }
// });

// /* Api to delete Lecturer */
// roadRouter.post("/delete-road", (req, res) => {
//     try {
//         if (req.body && req.body.mscb) {
//             road.deleteMany({ mscb: req.body.mscb }).then(() => {
//                 res.status(200).json({
//                     status: true,
//                     title: 'Lecturer deleted.'
//                 });
//             }).catch((err) => {
//                 res.status(400).json({
//                     errorMessage: err.message || err,
//                     status: false
//                 });
//             });
//         } else {
//             res.status(400).json({
//                 errorMessage: 'Add proper parameter first!',
//                 status: false
//             });
//         }
//     } catch (e) {
//         res.status(400).json({
//             errorMessage: 'Something went wrong!',
//             status: false
//         });
//     }
// });

// /*Api to get and search road with pagination and search by name*/
// roadRouter.get("/get-road", (req, res) => {
//     try {
//         var query = {};
//         if (req.query && req.query.search) {
//             query["$and"] = [];
//             query["$and"].push({
//                 name: { $regex: req.query.search }
//             });
//         }
//         var perPage = 5;
//         var page = req.query.page || 1;
        
//         road.find(query, { name: 1, desc: 1, mscb: 1, image: 1 })
//             .skip((perPage * page) - perPage).limit(perPage)
//             .then((data) => {
//                 road.find(query).count()
//                     .then((count) => {
//                         if (data && data.length > 0) {
//                             res.status(200).json({
//                                 status: true,
//                                 title: 'Lecturer retrived.',
//                                 roads: data,
//                                 current_page: page,
//                                 total: count,
//                                 pages: Math.ceil(count / perPage),
//                             });
//                         } else {
//                             res.status(400).json({
//                                 errorMessage: 'There is no road!',
//                                 status: false
//                             });
//                         }

//                     });

//             }).catch(err => {
//                 res.status(400).json({
//                     errorMessage: err.message || err,
//                     status: false
//                 });
//             });
//     } catch (e) {
//         res.status(400).json({
//             errorMessage: 'Something went wrong!',
//             status: false
//         });
//     }

// });




module.exports = roadRouter;