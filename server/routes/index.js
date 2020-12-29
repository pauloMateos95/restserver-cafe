const express = require('express');
const app = express();


// Endpoints
app.use( require('./user') );
app.use( require('./login') );




module.exports = app;