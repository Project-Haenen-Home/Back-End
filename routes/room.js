const express = require("express");
const Room = require("../models/Room");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const rooms = await Room.find();
        res.json(rooms);
    } catch(err) {
        console.log("Error while getting: " + err);
        res.status(500).json({ message: err });
    }
});

router.post("/", async (req, res) => {
    const room = new Room({ name: req.body.name });

    try {
        const save = await room.save();
        res.json(save);
    } catch(err) { 
        console.log("Error while saving: " + err);
        res.status(500).json({ message: err });
     };
});

router.get("/:roomID", async (req, res) => {
    try {
        const room = await Room.findById(req.params.roomID);
        res.json(room);
    } catch(err) {
        console.log("Error while getting(" + req.params.roomID + "): " + err);
        res.status(404).json({ message: "Entry not found" });
    }
});

router.patch("/:roomID", async (req, res) => {
    try {
        const room = await Room.findByIdAndUpdate(req.params.roomID, req.body);
        res.json(room);
    } catch(err) {
        console.log("Error while getting(" + req.params.roomID + "): " + err);
        res.status(404).json({ message: "Entry not found" });
    }
});

router.delete("/:roomID", async (req, res) => {
    try {
        const room = await Room.findByIdAndDelete(req.params.roomID);
        res.json(room);
    } catch(err) {
        console.log("Error while getting(" + req.params.roomID + "): " + err);
        res.status(404).json({ message: "Entry not found" });
    }
});

module.exports = router;