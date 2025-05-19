const express = require('express');
require('dotenv').config();
const cors = require('cors'); 
const routes = require("./routes/routes.js");
const {connectDB} = require("./database/dbConnection.js");
const {swaggerUi, swaggerDocs} = require("./middlewares/swagger.js")

const app = express();
const port = process.env.PORT;
app.use(cors()); 
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.listen(port, () => {
    console.log(`Project running ${port}`); 
});
connectDB();
app.use('/api/business', routes);

