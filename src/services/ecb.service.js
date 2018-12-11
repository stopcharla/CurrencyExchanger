const Big = require('big-js');
const parser = require('./currency.parser');

class ECBService {
    constructor(request) {
        this.updatedDay = undefined;
        this.request = request;
    }

    /**
     * Get the current days exchange rates published by ECB then returns the rate in terms of Euro for all currencies
     * @param {*} url 
     */
    getExchangeRates(url) {
        const Parser = new parser();
        return new Promise((resolve, reject) => {

            this.request.get(url).then((response) => {
                return (Parser.parseECBResponse(response))

            }).then((result) => {
                this.updatedDay = result.attributes.time;
                return (this.getRates(result.elements));

            }).then((rates) => {
                if (rates.length < 1) {
                    throw new Error("rates not available");
                }
                rates.push({ currency: 'EUR', rate: new Big('1') });
                resolve({ date: this.updatedDay, rates: rates });

            }).catch((err) => {
                console.log("error:", err);
                reject(err);
                
            });
        });

    }

    /**
     * extracts the currency and rate from all the xml attributes
     * @param {*} currencyElements 
     */
    getRates(currencyElements) {
        const rates = currencyElements.map((element) => {
            return ({ currency: element.attributes.currency, rate: new Big(element.attributes.rate) });
        });
        return (rates);
    }
}

module.exports = ECBService;