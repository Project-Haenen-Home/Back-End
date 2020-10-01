const mongoose = require("mongoose");

const TaskSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    finished: [{
        type: Date,
        required: true
    }],
    period: {
        type: Number,
        required: true
    },
    personID: mongoose.Schema.Types.ObjectId,
    roomID: mongoose.Schema.Types.ObjectId,
    comment: String
});

module.exports = mongoose.model("Task", TaskSchema);
