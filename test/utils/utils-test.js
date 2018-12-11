const expect = require('chai').expect;
const should = require('chai').should;
const utils = require('../../src/utils/utils');
const Big = require('big-js');

describe("Checking the currency conversion", () => {

    it("checking conversion from base to target", (done) => {
        let expectedResponse = { baseCurrency: 'USD', targetCurrency: 'JPY', conversionValue: '112.73' };
        utils.convertCurrency('USD', new Big('1.1425'), 'JPY', new Big('128.79')).then((response) => {
            expect(response).to.be.deep.equal(expectedResponse);
            done()
        }).catch((err) => {
            done(err);
        })
    });

    it("checking faulty currency and conversion from base to target", (done) => {
        let expectedResponse = { baseCurrency: 'USD', targetCurrency: 'JPY', conversionValue: '112.733456' };
        utils.convertCurrency('USD', null, 'JPY', new Big('128.79')).then((response) => {
            done()
        }).catch((err) => {
            expect(err).to.be.an('error')
            done();
        })
    });

    it("checking null currency name", (done) => {
        utils.convertCurrency('USD', new Big('1.1425'), null, new Big('128.79')).then((response) => {
            done(new Error('error'));
        }).catch((err) => {
            expect(err).to.be.an('error')
            done();
        })
    });

    it("checking for floating point roundoff conversion from base to target", (done) => {
        let expectedResponse = { baseCurrency: 'USD', targetCurrency: 'JPY', conversionValue: '112.73456' };
        utils.convertCurrency('USD', new Big('1.1425'), 'JPY', new Big('128.79')).then((response) => {
            expect(response.conversionValue).to.be.not.equal(expectedResponse.conversionValue);
            done()
        }).catch((err) => {
            done(err);
        })
    });

    it("check if date object is returned for given date", (done) => {
        let testDate = '2018-12-11';
        let expectedDate = new Date(testDate);
        let originalDate = utils.getToday(testDate);
        expect(originalDate.toDateString()).to.be.equal(expectedDate.toDateString());
        done();
    })

    it("check if today is returned for empty date provided", (done) => {
        let today = new Date();
        let timestamp = today.setHours(0, 0, 0, 0) - today.getTimezoneOffset() * 60 * 1000;
        var expectedDate = new Date(timestamp);

        let originalDate = utils.getToday(undefined);
        expect(originalDate.toDateString()).to.be.equal(expectedDate.toDateString());
        done();
    })


})