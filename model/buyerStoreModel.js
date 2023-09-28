const mongoose = require("mongoose");
const schema = mongoose.Schema;

const buyerStore = new schema({
    storeName: { type: String, require: true },
    status: { type: String, require: true },
    address: { type: String, require: true },
    distance: { type: String, require: true },
    timings: { type: String, require: true },
    availableBrand: { type: String, require: true },
    ratings: { type: String, require: true },
});

module.exports = mongoose.model("buyerStore", buyerStore);
