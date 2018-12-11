const expect = require('chai').expect;
const should = require('chai').should;
const Big = require('big-js');
const config = require('../../src/config/config');
const ECB = require('../../src/services').getECBService;

const sampleXML = `<gesmes:Envelope xmlns:gesmes="http://www.gesmes.org/xml/2002-08-01" xmlns="http://www.ecb.int/vocabulary/2002-08-01/eurofxref">
<gesmes:subject>Reference rates</gesmes:subject>
<gesmes:Sender>
<gesmes:name>European Central Bank</gesmes:name>
</gesmes:Sender>
<Cube>
<Cube time="2018-12-07">
<Cube currency="USD" rate="1.1425"/>
<Cube currency="JPY" rate="128.79"/>
</Cube>
</Cube>
</gesmes:Envelope>`

const request = {
    get : function(url){
        return Promise.resolve(sampleXML);
    }
}

let ECBService = new ECB(request);


describe("Checking the ecb service api", () => {

    it("check if xml is fetched and parsed properly", (done) => {
        ECBService.getExchangeRates(config.ecb_exchange_url_xml).then((response) => {
            console.log(response);
            expect(response.date).to.be.equal('2018-12-07');
            expect(response.rates).to.be.an('array').of.length(3);
            done();
        }).catch((err) => {
            done(err);
        });
    });

    it("get rates from xml attributes", (done) => {
        let currencyAttributes = [{
            type: 'element',
            name: 'Cube',
            attributes: { currency: 'USD', rate: '1.1425' }
        },
        {
            type: 'element',
            name: 'Cube',
            attributes: { currency: 'JPY', rate: '128.79' }
        },
        {
            type: 'element',
            name: 'Cube',
            attributes: { currency: 'BGN', rate: '1.9558' }
        },
        {
            type: 'element',
            name: 'Cube',
            attributes: { currency: 'CZK', rate: '25.866' }
        }];

        let expectedRates = [];
        currencyAttributes.forEach((currencyAttribute) => {
            expectedRates.push({ currency: currencyAttribute.attributes.currency, rate: new Big(currencyAttribute.attributes.rate) });
        });

        let rates = ECBService.getRates(currencyAttributes);
        expect(expectedRates).to.be.deep.equals(rates);
        done();
    });


})