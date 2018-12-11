let mongoose = require('./config/mongoose');
mongoose();
// initialized mongo

module.exports = require("./config/express");