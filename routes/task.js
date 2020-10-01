const express = require("express");
const Task = require("../models/Task");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch(err) {
        console.log("Error while getting: " + err);
        res.status(500).json({ message: err });
    }
});

router.post("/", async (req, res) => {
    const task = new Task({ name: req.body.name, finished: [Date.now()], period: req.body.period, personID: req.body.personID, roomID: req.body.roomID, comment: req.body.comment });

    try {
        const save = await task.save();
        res.json(save);
    } catch(err) { 
        console.log("Error while saving: " + err);
        res.status(500).json({ message: err });
     };
});

router.get("/:taskID", async (req, res) => {
    try {
        const task = await Task.findById(req.params.taskID);
        res.json(task);
    } catch(err) {
        console.log("Error while getting(" + req.params.taskID + "): " + err);
        res.status(404).json({ message: "Entry not found" });
    }
});

router.patch("/:taskID", async (req, res) => {
    var finishArr;
    try {
        const task = await Task.findById(req.params.taskID);
        finishArr = task.finished;
        if(req.body.finished) finishArr.push(Date.now());
    } catch(err) {
        console.log("Error while getting(" + req.params.taskID + "): " + err);
        res.status(404).json({ message: "Entry not found" });
        return;
    }
    
    try {
        const task = await Task.findByIdAndUpdate(req.params.taskID, { name: req.body.name, finished: finishArr, period: req.body.period, personID: req.body.personID, roomID: req.body.roomID, comment: req.body.comment });
        res.json(task);
    } catch(err) {
        console.log("Error while getting(" + req.params.taskID + "): " + err);
        res.status(404).json({ message: "Entry not found" });
    }
});

router.delete("/:taskID", async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.taskID);
        res.json(task);
    } catch(err) {
        console.log("Error while getting(" + req.params.taskID + "): " + err);
        res.status(404).json({ message: "Entry not found" });
    }
});

module.exports = router;