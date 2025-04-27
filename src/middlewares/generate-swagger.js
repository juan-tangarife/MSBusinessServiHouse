const swaggerAutogen = require('swagger-autogen')();
require('dotenv').config();

const doc = {
  info: {
    title: 'MSBusiness',
    description: 'Documentación de la API de negocio para ServiHouse',
  },
  host: `localhost:${process.env.PORT || 3000}`,
  schemes: ['http'],
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['src/routes/routes.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);