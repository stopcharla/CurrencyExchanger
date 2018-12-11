'use strict';

const config = require('../config/config');
const BaseController = require('./base.controller');
const ECB = require('../services').getECBService;
const request = require('request-promise');
const utils = require('../utils/utils');
const conversionDbModel = require('../models').conversionModel;
const HttpStatus = require('http-status');

class CurrencyController extends BaseController {

    constructor() {
        super();
        this.lastUpdatedDate = undefined;
        this.rates = [];
    }

    /**
     * Function to upload images from device one at a time and returns the cloud key in the response 
     * so the device can combine images to a person i.e. a person can have multiple images
     * @param {*} req 
     * @param {*} res 
     */
    computeCurrency(req, res) {
        this.getECBExchangeRates(utils.getToday(this.lastUpdatedDate)).then(() => {
            res.json(super.getSuccessResponse({ rates: this.rates }));
        }).catch((err) => {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(super.getErrorResponse(err));
        });
    }


    /**
     * obtain ecb exchange rates and insert all the conversion currency values to db
     * @param {*} date 
     */
    getECBExchangeRates(date) {
        return new Promise((resolve, reject) => {
            this.checkIfTransactionsUpdatedToDb(date).then((dbCheck) => {
                console.log("checkIfTransactionsUpdatedToDb:", dbCheck);
                if (dbCheck) {
                    console.log("data already updated for today");
                    resolve();
                } else {
                    let ECBService = new ECB(request);
                    ECBService.getExchangeRates(config.ecb_exchange_url_xml).then((response) => {
                        this.lastUpdatedDate = response.date;
                        this.rates = response.rates;
                        console.log('currency received now calculating exchanges');
                        return this.calculatePossibleCurrencyTransactions();
                    }).then((transactions) => {
                        this.insertAllTransactionsToDatabase(transactions);
                    }).then(() => {
                        resolve();
                    }).catch((err) => {
                        reject(err);
                    });
                }
            }).catch((err) => {
                reject(err);
            })
        })
    }

    /**
     * calculate all currencies conversion to one another then inset to database
     */
    calculatePossibleCurrencyTransactions() {
        let promises = []
        this.rates.forEach((baseRate) => {
            let baseCurrency = baseRate.currency;
            let baseConversionValue = baseRate.rate;
            this.rates.forEach((targetRate) => {
                if (targetRate.currency !== baseCurrency) {
                    promises.push(utils.convertCurrency(baseCurrency, baseConversionValue, targetRate.currency, targetRate.rate));
                }
            })
        });
        return new Promise((resolve, reject) => {
            Promise.all(promises).then((totalTransactions) => {
                resolve(totalTransactions);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    /**
     * takes in total transaction for the day and appends date key to each object then bulk inserts all the transactions to databse
     * @param {*} totalTransactions 
     */
    insertAllTransactionsToDatabase(totalTransactions) {
        return new Promise((resolve, reject) => {
            let currentDate = new Date(this.lastUpdatedDate);
            let transactions = utils.addDateObjectToTransactions(totalTransactions, currentDate);
            conversionDbModel.insertMany(transactions).then((response) => {
                console.log('successfully inserted values to db');
                resolve();
            }).catch((err) => {
                console.error('error occurred while inserting docs:', err);
                reject(err);
            });
        })
    }

    /**
     * returns the current rate for the required currency
     * @param {*} currency 
     */
    getCurrencyRate(currency) {
        return this.rates.filter((rate) => rate.currency === currency)[0]
    }

    /**
     * Checks if the conversion data is already populated to db. Resolves true if the data is already present,
     * else resolves false to continue with fetching of conversion details from service
     * @param {*} date 
     */
    checkIfTransactionsUpdatedToDb(date) {
        return new Promise((resolve, reject) => {

            conversionDbModel.find({ date: date }).limit(1).exec().then((docs) => {
                if (docs.length == 1) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            }).catch((err) => {
                console.error("error in checking db:", err);
                reject(err);
            })
        })
    }

}

module.exports = CurrencyController;