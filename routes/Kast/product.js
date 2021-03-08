const express = require("express");
const Product = require("../../models/Product");

const router = express.Router();

router.get("/", async (req, res) => {
    var query = new Object();
    if(req.query.categoryID != null) query.categoryID = req.query.categoryID;

    try {
        var products = await Product.find(query);
        
        res.json(products);
    } catch(err) {
        console.log("Error while getting: " + err);
        res.status(500).json({ message: err });
    }
});

router.post("/", async (req, res) => {
    var newProduct = new Object();

    if(req.body.name != null && req.body.name != "" && req.body.categoryID != null && req.body.categoryID != "" && req.body.amount != null) {
        newProduct.name = req.body.name;
        newProduct.categoryID = req.body.categoryID;
        newProduct.amount = req.body.amount;
        if(req.body.deadline != null && req.body.deadline != "") newProduct.deadline = req.body.deadline;

        if(req.body.weight != null && req.body.weight != "")  { 
            newProduct.weight = req.body.weight;
            if(req.body.unit != null && req.body.unit != "") newProduct.unit = req.body.unit;
        }
        if(req.body.comment != null && req.body.comment != "") newProduct.comment = req.body.comment;

        const product = new Product(newProduct);

        try {
            const save = await product.save();
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

router.get("/:productID", async (req, res) => {
    try {
        const product = await Product.findById(req.params.productID);
        res.json(product);
    } catch(err) {
        console.log("Error while getting(" + req.params.productID + "): " + err);
        res.status(404).json({ message: "Entry not found" });
    }
});

router.patch("/:productID", async (req, res) => {   
    console.log(req.body);
    try {
        const product = await Product.findByIdAndUpdate(req.params.productID, req.body);
        res.json(product);
    } catch(err) {
        console.log("Error while patching(" + req.params.productID + "): " + err);
        res.status(404).json({ message: "Entry not found" });
    }
});

router.delete("/:productID", async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.productID);
        res.json(product);
    } catch(err) {
        console.log("Error while getting(" + req.params.productID + "): " + err);
        res.status(404).json({ message: "Entry not found" });
    }
});

module.exports = router;