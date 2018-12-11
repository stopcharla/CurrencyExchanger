const Big = require('big-js');

/**
 * Converts the base curency in terms of target currency, this can be extended to calculate the for a provided amount as well
 * @param {*} baseCurrency 
 * @param {*} baseCurrencyValue 
 * @param {*} targetCurrency 
 * @param {*} targetCurrencyValue 
 */
var convertCurrency = function (baseCurrency, baseCurrencyValue, targetCurrency, targetCurrencyValue, amountToConvert = 1) {
    return new Promise((resolve, reject) => {
        try {
            // get exchange rate of base currency, otherwise fail
            if (!baseCurrency || !targetCurrency) {
                throw new Error('error occured');
            }
            const conversionValue = new Big(amountToConvert).div(baseCurrencyValue).times(targetCurrencyValue);
            resolve({ baseCurrency: baseCurrency, targetCurrency: targetCurrency, conversionValue: conversionValue.toFixed(2) });
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * adds date object to each transaction in the array of transactions provided
 * @param {*} totalTransactions 
 * @param {*} date 
 */
var addDateObjectToTransactions = function (totalTransactions, date) {
    return totalTransactions.map((transaction) => {
        let datedTransaction = Object.assign({}, transaction);
        datedTransaction.date = date;
        return datedTransaction;
    });
}

/**
 * returns date object for provided date or returns the current day date object
 * @param {*} date 
 */
var getToday = function (date) {
    if (date === undefined) {
        let today = new Date();
        let timestamp = today.setHours(0, 0, 0, 0) - today.getTimezoneOffset() * 60 * 1000;
        var myToday = new Date(timestamp);
    } else {
        myToday = new Date(date);
    }
    return myToday;
}

module.exports = {
    convertCurrency: convertCurrency,
    getToday: getToday,
    addDateObjectToTransactions: addDateObjectToTransactions
}