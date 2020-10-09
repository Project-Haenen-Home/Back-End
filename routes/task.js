const express = require("express");
const Task = require("../models/Task");

const router = express.Router();

router.get("/", async (req, res) => {
    var query = new Object();
    if(req.query.roomID != null) query.roomID = req.query.roomID;
    if(req.query.personID != null) query.personID = { $in: req.query.personID.split('|') };

    try {
        var tasks = await Task.find(query);
        var output = [];


        for(var i = 0; i < tasks.length; i++) {
            var smallest = { index: i, key: Number(toDeadline(tasks[i].finished[tasks[i].finished.length - 1], tasks[i].period)) };

            for(var j = i + 1; j < tasks.length; j++) {
                const curr = Number(toDeadline(tasks[j].finished[tasks[j].finished.length - 1], tasks[j].period));
                if(curr < smallest.key) {
                    smallest.index = j;
                    smallest.key = curr;
                }
            }

            var temp = tasks[i];
            tasks[i] = tasks[smallest.index];
            tasks[smallest.index] = temp;
            
            if(req.query.dayFilter == null || smallest.key <= req.query.dayFilter) output.push(tasks[i]);
            else break;
        }

        // for(var i = 0; i < tasks.length; i++) {
            
        //     var key = Number(toDeadline(tasks[i].finished[tasks[i].finished.length - 1], tasks[i].period));
        //     var task = tasks[i];
        //     var j = i - 1;
            
        //     while(j >= 0 && Number(toDeadline(tasks[j].finished[tasks[j].finished.length - 1], tasks[j].period)) > key) {
        //         tasks[j + 1] = tasks[j];
        //         j--;
        //     }

        //     tasks[j + 1] = task;
        // }

        res.json(output);
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

        if(task.finished != null) finishArr = task.finished;
        else finishArr = [];

        if(req.body.finished == true) {
            finishArr.push(Date.now());
            req.body.finished = finishArr;
        } else delete req.body.finished;
    } catch(err) {
        console.log("Error while getting(" + req.params.taskID + "): " + err);
        res.status(404).json({ message: "Entry not found" });
        return;
    }
    
    try {
        const task = await Task.findByIdAndUpdate(req.params.taskID, req.body);
        res.json(task);
    } catch(err) {
        console.log("Error while patching(" + req.params.taskID + "): " + err);
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

function toDeadline(date, period) {
    return (period - (new Date() - new Date(date)) / (1000 * 3600 * 24)).toFixed(0);
}

module.exports = router;