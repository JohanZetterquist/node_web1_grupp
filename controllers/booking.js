const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');
const Cars = require('../models/car_admin');
const mongoose = require('mongoose');

var ObjectId = require('mongoose').Types.ObjectId;

//Ny bokning
router.post('/', (req, res) => {
  var booking = new Booking(req.body);
  var carid = req.body.car_id;
  var userid = req.body.user_id;
  var bookfrom = new Date(req.body.date_from);
  var bookto = new Date(req.body.date_to);
  var bookingid = req.body.booking_id;

  //sök i dbn efter matches med query_date mellan date_from till date_to
  Booking.aggregate([

    {
      $lookup:
      {
        from: "cars",
        localField: "car_id",
        foreignField: "_id",
        as: "res"
      }
    },
    {
      $match: { "car_id": mongoose.Types.ObjectId(carid) }
    }

  ],

  function(err, result) {
    if (err) {
      console.log(err);
    } else {

      //Ny bokning
      booking.save(error => {
        if (error) res.json({ message: error })
        else {

          Cars.findOneAndUpdate({ _id: carid }, {
            $push: {
              booked: mongoose.Types.ObjectId(booking._id)
              //"booked": new ObjectId(bookingid)
            }
          }, error => {
            if (error) res.json({ message: error })
            else {
              res.format({
                'json': () => res.json(booking),
                '*/*': () => res.redirect('/boka-bil')
              })
            }
          });
        }
      });

    }
  }

);





});


//Avboka en bil
router.delete('/:car_id', (req, res) => {

  var carid = req.body.car_id;
  var bookingid = req.body.booking_id;

  Booking.remove({ _id: bookingid }, error => {
    if (error) res.json({ message: error })
    else {

      Cars.update({
        _id:carid
      },
      {
        $pull:{
          "booked": new ObjectId(bookingid)
        }
      }, err => {
        if (err) res.json({ message: err })
        else {
          res.json({ message: 'success' })
        }
      });

    }
  });

});


module.exports = router;
