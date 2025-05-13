const express = require('express');
const router = express.Router();

const {createLocation} = require('../controller/locationController.js');

router.post('/', createLocation);

module.exports = router;