module.exports = {
    endpoint:"/api/",
    port:8080,
    ecb_exchange_url_xml:"https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml",
    db: 'mongodb://mongo/CurrencyConversionDatabase',
    mongoAuthOptions:{auth:{authdb:"admin"}}
}