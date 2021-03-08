const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    categoryID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    deadline: Date,
    
    weight: Number,
    unit: String,
    comment: String
});

module.exports = mongoose.model("Product", ProductSchema);
