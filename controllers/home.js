//Routes for base pages

const express = require('express');
const router = express.Router();
const Cars = require('../models/car_admin');
const User = require('../models/user');
const Booking = require('../models/booking');
const mongoose = require('mongoose');

//Root route, if user is logged in goto min-sida else the login page
router.get('/', (req, res) => {
  if (req.session.user) {
    res.redirect('/min-sida');
  } else {
    res.render('index.ejs', req.session.user);
  }
});

//Route for editing/adding/removing cars from the db
router.get('/admin', (req, res) => {

  Cars.aggregate(
    [
      {$lookup: {
        from: "users",
        localField: "booked",
        foreignField: "_id",
        as: "res_doc"}
      }
    ],
    function(err,result) {
      if (err) {
        console.log(err);
      } else {
        res.render('car_admin.ejs', {allcars: result});
      }
    }
  );

});

//Route for signup page
router.get('/signup', (req, res) => {
  res.render('signup.ejs');
});





router.get('/min-sida', (req, res) => {
  if (!req.session.user) {
    res.redirect('/');
  } else {
    var u_id = req.session.user._id;

    Cars.aggregate([
      {
        $unwind: "$booked"
      },
      {
        $lookup:
        {
          from: "bookings",
          localField: "booked",
          foreignField: "_id",
          as: "res"
        }
      },
      {
        $match: { "res.user_id": mongoose.Types.ObjectId(u_id) }
      }
    ],

    function(err, result) {
      if (err) {
        console.log(err);
      } else {
        res.render('min-sida.ejs', {
          userbooking: result,
          user_id: u_id
        });
      }
    }

  );
}

});

router.get('/boka-bil', (req, res) => {
  if (!req.session.user) {
    res.redirect('/');
  } else {
    
    var u_id = req.session.user._id;

    Cars.find(function(err, coll) {
      res.render('boka-bil.ejs', {
        allcars: coll,
        user_id: u_id,
      });
    });


  }
});

module.exports = router
