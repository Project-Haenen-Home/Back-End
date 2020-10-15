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
        
        res.json(output);
    } catch(err) {
        console.log("Error while getting: " + err);
        res.status(500).json({ message: err });
    }
});

router.post("/", async (req, res) => {
    var newTask = new Object();

    if(req.body.name != null && req.body.name != "" && req.body.period != null && req.body.period != "" && req.body.personID != null && req.body.personID != "" && req.body.roomID != null && req.body.roomID != "") {
        newTask.name = req.body.name;
        newTask.period = req.body.period;
        newTask.personID = req.body.personID;
        newTask.roomID = req.body.roomID;
        newTask.finished = [Date.now()];

        if(req.body.comment != null && req.body.comment != "") newTask.comment = req.body.comment;

        if(req.body.rotate != null && req.body.rotate != false && req.body.rotateGroup != null && req.body.rotateGroup != []) {
            newTask.rotate = true;
            newTask.rotateGroup = req.body.rotateGroup;
        } else {
            newTask.rotate = false;
        }

        const task = new Task(newTask);

        try {
            const save = await task.save();
            res.json(save);
        } catch(err) { 
            console.log("Error while saving: " + err);
            res.status(500).json({ message: err });
        };

    } else {
        const err = "Some required parameters are not filled in!";
        console.log("Error while saving: " + err);
        res.status(500).json({ message: err });
    }
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
            if(task.rotate != null && task.rotate != false) {
                var index = -1;

                for(var i = 0; i < task.rotateGroup.length; i++) {
                    if(task.rotateGroup[i].toString() === task.personID.toString()) {
                        index = i;
                        break;
                    }
                }

                if((index + 1) >= task.rotateGroup.length) index = 0;
                else index++;

                req.body.personID = task.rotateGroup[index];
            }

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