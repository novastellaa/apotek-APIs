const express = require('express');
const bodyParser = require('body-parser');
const router = require('./routes');
const cookieParser = require('cookie-parser');
require('dotenv').config();


const app = express();
app.use(cookieParser());

//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//routes
app.use('/apotek', router);

//server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`server is running in port ${PORT}`);
});