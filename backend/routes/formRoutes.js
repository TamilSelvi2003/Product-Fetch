const express = require("express");
const router = express.Router();
const Form = require("../models/Form");


router.post("/submit", async (req, res) => {
    try {
        const { name, email, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const newForm = new Form({ name, email, message });
        await newForm.save();
        res.status(201).json({ message: "Form submitted successfully" });
    } catch (error) {
        console.error(" Error saving form:", error);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
