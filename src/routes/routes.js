const express = require('express');
const router = express.Router();
const {testClients} = require("../controller/clientController.js")

router.get("/client", testClients);
module.exports = router;