const express = require("express");
const Category = require("../../models/Category");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch(err) {
        console.log("Error while getting: " + err);
        res.status(500).json({ message: err });
    }
});

router.post("/", async (req, res) => {
    const category = new Category({ name: req.body.name });

    try {
        const save = await category.save();
        res.json(save);
    } catch(err) { 
        console.log("Error while saving: " + err);
        res.status(500).json({ message: err });
     };
});

router.get("/:categoryID", async (req, res) => {
    try {
        const category = await Category.findById(req.params.categoryID);
        res.json(category);
    } catch(err) {
        console.log("Error while getting(" + req.params.categoryID + "): " + err);
        res.status(404).json({ message: "Entry not found" });
    }
});

router.patch("/:categoryID", async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.categoryID, req.body);
        res.json(category);
    } catch(err) {
        console.log("Error while getting(" + req.params.categoryID + "): " + err);
        res.status(404).json({ message: "Entry not found" });
    }
});

router.delete("/:categoryID", async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.categoryID);
        res.json(category);
    } catch(err) {
        console.log("Error while getting(" + req.params.categoryID + "): " + err);
        res.status(404).json({ message: "Entry not found" });
    }
});

module.exports = router;