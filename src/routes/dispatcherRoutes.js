const express = require('express');
const router = express.Router();

const {createDispatcher} = require('../controller/dispatcherController.js');

router.post('/create', createDispatcher);

module.exports = router;