"use strict";
const currencyController = require('../controllers').getCurrencyController;
const CurrencyController = new currencyController();
const express = require('express');
const router = express.Router();

router.get('/compute', (req, res) => {
    CurrencyController.computeCurrency(req,res);
});

module.exports = router;