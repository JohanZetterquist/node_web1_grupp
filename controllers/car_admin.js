//User controlle handles routes for user functions

const express = require('express');
const router = express.Router();
const Cars = require('../models/car_admin')

//Add a new car
router.post('/', (req, res) => {
  var cars = new Cars(req.body);
  cars.save(error => {
    if (error) res.json({ message: error })
    else {
      res.format({
        'json': () => res.json(cars),
        '*/*': () => res.redirect('/admin')
      });
    }
  });
});


//Gets a car
router.get('/:id', (req, res) => {
  Cars.findById(req.params.id, (err, data) => {
    if (err) res.json(err)
    else res.json(data)
  });
})

//Delete a car
router.delete('/:id', (req, res) => {
  Cars.remove({ _id: req.params.id }, error => {
    if (error) res.json({ message: error })
    else res.json({ message: 'success' })
  });
});

//Update a car
router.patch('/:id', (req, res) => {
  Cars.findOneAndUpdate({ _id: req.params.id }, {$set:{
    typ: req.body.typ,
    automat: req.body.automat,
    rail: req.body.rail,
    price: req.body.price,
    seats: req.body.seats
  }}, error => {
    if (error) res.json({ message: error })
    else {
      res.format({
        'json': () => Cars.findById(req.params.id, (err, data) => {
          if (err) res.json(err)
          else res.json(data)
        }),
        'default': () => res.json({ message: 'success' })
      });
    }
  });
});

module.exports = router
