const express = require('express');
require('dotenv').config();
const cors = require('cors'); 
const routes = require("./routes/routes.js");
const {connectDB} = require("./database/dbConnection.js");
const {swaggerUi, swaggerDocs} = require("./middlewares/swagger.js")

const app = express();
const port = process.env.PORT;
app.use(cors(
    {
        origin: '*', // Permitir todas las solicitudes de origen
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Métodos permitidos
        allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
    }
)); 
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.listen(port, '0.0.0.0',() => {
    console.log(`Project running ${port}`); 
});
connectDB();
app.use('/api/business', routes);

