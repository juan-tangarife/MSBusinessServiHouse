const express = require('express');
const router = express.Router();

const {createLocation, getLocations, getLocationById, updateLocation, deleteLocation} = require('../controller/locationController.js');

router.post('/create', createLocation);
router.get('/get', getLocations);
router.get('/get/:id', getLocationById);
router.put('/update/:id', updateLocation);
router.delete('/delete/:id', deleteLocation);

module.exports = router;