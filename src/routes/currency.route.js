"use strict";
const currencyController = require('../controllers').getCurrencyController;
const express = require('express');
const router = express.Router();
const ECB = require('../services').getECBService;
const request = require('request-promise');
const conversionDbModel = require('../models').conversionModel;
const CurrencyController = new currencyController(new ECB(request), conversionDbModel);

router.get('/compute', (req, res) => {
    CurrencyController.computeCurrency(req,res);
});

module.exports = router;