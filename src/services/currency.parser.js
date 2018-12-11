const convert = require('xml-js');

class CurrencyParser {
    constructor() {
        this.options = {
            compact: false,
            spaces: 4,
            ignoreDeclaration: true
        }
    }

    /**
     * The method is custom written to parse xml response from ECB, the class can be extended to parse other data from various sites as well
     * @param {*} xml 
     */
    parseECBResponse(xml) {
        return new Promise((resolve, reject) => {
            try {
                const rates = convert.xml2js(xml, this.options).elements[0].elements
                    .filter(element => element.name === 'Cube')[0]
                    .elements[0]
                resolve(rates);
            } catch (err) {
                reject(err);
            }
        });
    }
}

module.exports = CurrencyParser;