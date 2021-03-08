const mongoose = require("mongoose");

const PersonSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: String
});

module.exports = mongoose.model("Person", PersonSchema);