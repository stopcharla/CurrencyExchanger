"use strict";

const config = require('./config'),
    express = require('express'),
    currencyRoute = require('../routes/currency.route.js');

var router = express.Router();

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) => {
    console.log("health check");
    res.send('OK')
});

router.use('/v1/currency/',currencyRoute);

module.exports = router;