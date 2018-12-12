"use strict";

const express = require('express'),
    bodyParser = require('body-parser'),
    currencyRoute = require('../routes/currency.route.js');

const router = express.Router();

router.use(bodyParser.json());
/** GET /health-check - Check service health */
router.get('/health-check', (req, res) => {
    console.log("health check");
    res.send('OK')
});

router.use('/v1/currency/', currencyRoute);

module.exports = router;