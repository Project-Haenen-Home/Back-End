const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    deadline: Date,
    categoryID: mongoose.Schema.Types.ObjectId,
    amount: Number,
    unit: String,
    comment: String
});

module.exports = mongoose.model("Product", ProductSchema);
