const expect = require('chai').expect;
const request = require('request-promise');
const baseCurrencyUrl = 'http://localhost:8080/'
const computeCurrencyURL = 'api/v1/currency/compute';


describe("checking compute currency api", () => {
    it("Should return 200", (done) => {
        request.get(baseCurrencyUrl + computeCurrencyURL).then((response) => {
            let res = JSON.parse(response);
            expect(res.status.code).to.equal(200);
            done();
        }).catch((err) => {
            done(err)
        });
    });

    it("Should return 404 as url is wrong", (done) => {
        request.get(baseCurrencyUrl + computeCurrencyURL+"ert").then((response) => {
            done(new Error());
        }).catch((err) => {
            expect(err.statusCode).to.be.equal(404);
            done()
        });
    });
});