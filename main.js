"use strict";


var express = require('express');
const config = require('./src/config/config');
var app = express();

app.use(config.endpoint, require('./src'));

app.listen(config.port, () => {
    console.log("server running on port: ",config.port);
});


