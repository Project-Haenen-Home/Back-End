const mongoose = require("mongoose");

const RoomSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Room", RoomSchema);