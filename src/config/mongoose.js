const config = require('./config'),
    mongoose = require('mongoose');

module.exports = function () {
    console.log('trying to connect to mongo ',config.db);
    var db = mongoose.connect(config.db, config.mongoAuthOptions);

    mongoose.connection.on("error", function(err) {
        console.error("Could not connect to mongo server!",err);
        return console.log(err);
    });

    // require all mongoose models
    require('../models');

    return db;
};
