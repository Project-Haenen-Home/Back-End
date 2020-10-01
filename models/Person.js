const mongoose = require("mongoose");

const PersonSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Person", PersonSchema);