const express = require('express');
const router = express.Router();

const { createProvider, getProviders, getProviderById, updateProvider, deleteProvider } = require('../controller/providerController.js');

router.post('/create', createProvider);
router.get('/get', getProviders);
router.get('/get/:id', getProviderById);
router.put('/update/:id', updateProvider);
router.delete('/delete/:id', deleteProvider);

module.exports = router;