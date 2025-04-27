const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json'); 

module.exports = { swaggerUi, swaggerDocs: swaggerDocument };