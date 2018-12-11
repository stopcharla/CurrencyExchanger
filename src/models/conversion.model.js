const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let conversionSchema = new Schema({
    baseCurrency: {
        type: String,
        required: true
    },
    targetCurrency: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    conversionValue: {
        type: String,
        required: true
    }
});

let conversionModel = mongoose.model("conversionData", conversionSchema);

module.exports = conversionModel;