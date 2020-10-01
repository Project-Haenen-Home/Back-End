const express = require("express");
const Person = require("../models/Person");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const persons = await Person.find();
        res.json(persons);
    } catch(err) {
        console.log("Error while getting: " + err);
        res.status(500).json({ message: err });
    }
});

router.post("/", async (req, res) => {
    const person = new Person({ name: req.body.name });

    try {
        const save = await person.save();
        res.json(save);
    } catch(err) { 
        console.log("Error while saving: " + err);
        res.status(500).json({ message: err });
     };
});

router.get("/:personID", async (req, res) => {
    try {
        const person = await Person.findById(req.params.personID);
        res.json(person);
    } catch(err) {
        console.log("Error while getting(" + req.params.personID + "): " + err);
        res.status(404).json({ message: "Entry not found" });
    }
});

router.patch("/:personID", async (req, res) => {
    try {
        const person = await Person.findByIdAndUpdate(req.params.personID, { name: req.body.name });
        res.json(person);
    } catch(err) {
        console.log("Error while getting(" + req.params.personID + "): " + err);
        res.status(404).json({ message: "Entry not found" });
    }
});

router.delete("/:personID", async (req, res) => {
    try {
        const person = await Person.findByIdAndDelete(req.params.personID);
        res.json(person);
    } catch(err) {
        console.log("Error while getting(" + req.params.personID + "): " + err);
        res.status(404).json({ message: "Entry not found" });
    }
});

module.exports = router;