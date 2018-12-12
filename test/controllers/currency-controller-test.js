const expect = require('chai').expect;
const Big = require('big-js');
const currencyCtrl = require('../../src/controllers').getCurrencyController;

const sampleResponse = {
    date: '2018-12-08',
    rates: [{ currency: 'USD', rate: new Big(1.1843) },
    { currency: 'EUR', rate: new Big(1) },
    { currency: 'JPY', rate: new Big(128.34) }],
    transactions: [{
        baseCurrency: 'USD',
        targetCurrency: 'EUR',
        conversionValue: '0.84'
    },
    {
        baseCurrency: 'USD',
        targetCurrency: 'JPY',
        conversionValue: '108.37'
    },
    {
        baseCurrency: 'EUR',
        targetCurrency: 'USD',
        conversionValue: '1.18'
    },
    {
        baseCurrency: 'EUR',
        targetCurrency: 'JPY',
        conversionValue: '128.34'
    },
    {
        baseCurrency: 'JPY',
        targetCurrency: 'USD',
        conversionValue: '0.01'
    },
    {
        baseCurrency: 'JPY',
        targetCurrency: 'EUR',
        conversionValue: '0.01'
    }]

}

const model = {
    insertMany: function (transactions) {
        return Promise.resolve(transactions);
    },
    find: function () {
        return {
            limit: function () {
                return {
                    exec: function () {
                        return Promise.resolve([])
                    }
                }
            }
        }
    }
}

const ecbService = {
    getExchangeRates: function (url) {
        return Promise.resolve(sampleResponse);
    }
}


let currencyController = new currencyCtrl(ecbService, model);

describe("Checking the currency controler api", () => {

    before((done) => {
        currencyController.getECBExchangeRates("test string").then((res) => {
            expect(res).to.be.an('array').of.length(6);
            done();
        }).catch((err) => {
            done(err);
        })
    });

    it("calculate possible currency transactions api", (done) => {
        currencyController.calculatePossibleCurrencyTransactions().then((transactions) => {
            expect(transactions).to.be.an('array').of.length(6);
            done();
        }).catch((err) => {
            done(err);
        });
    });

    it("get Currency Rate", (done) => {
        let sampleCurrency = sampleResponse.rates[0];
        let response = currencyController.getCurrencyRate(sampleCurrency.currency);
        expect(response).to.be.equal(sampleCurrency);
        done();
    });

    it("insert all transactions to database", (done) => {
        currencyController.insertAllTransactionsToDatabase(sampleResponse.transactions).then((response) => {
            response.forEach(element => {
                expect(element).to.have.property('date');
            });
            done();
        }).catch((err) => {
            done(err);
        })
    });

    it("check if transactions are already updated to Db should return empty", (done) => {
        currencyController.checkIfTransactionsUpdatedToDb(new Date(sampleResponse.date)).then((res) => {
            expect(res).to.be.equal(false);
            done();
        }).catch((err) => {
            done(err);
        })
    });

})