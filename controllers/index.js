//Main controller loaded by app. Loads all other controllers

const express = require('express');
const router = express.Router();

//Controllers to load
router.use('/', require('./home'));
router.use('/users', require('./user'));
router.use('/cars', require('./car_admin'));
router.use('/bookings', require('./booking'));

module.exports = router