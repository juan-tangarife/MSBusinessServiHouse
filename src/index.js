const express = require('express');
require('dotenv').config();
const routes = require("./routes/routes.js");
const {connectDB} = require("./database/dbConnection.js");
const {swaggerUi, swaggerDocs} = require("./middlewares/swagger.js")

const app = express();
const port = process.env.PORT;
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.listen(port, () => {
    console.log(`Project running ${port}`); 
});
connectDB();
app.use('/api/business', routes);

