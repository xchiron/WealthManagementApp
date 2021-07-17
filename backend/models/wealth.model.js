const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const wealthSchema = new Schema({
    wType: { type: String, required: true },
    wName: { type: String, required: true },
    wAsset: {type: Number, required: true},
    wLiability: {type: Number, required: true},
}, {
    timestamps: true,
});


const Wealth = mongoose.model('Wealth', wealthSchema);

module.exports = Wealth;