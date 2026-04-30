const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/", (req, res) => {
    const { name, email, age } = req.body;

    const sql = "INSERT INTO students (name, email, age) VALUES (?, ?, ?)";
    
    db.query(sql, [name, email, age], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        res.json({ message: "Student added", id: result.insertId });
    });
});

router.get("/", (req, res) => {
    const sql = "SELECT * FROM students";

    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        res.json(result);
    });
});

router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { name, email, age } = req.body;

    const sql = "UPDATE students SET name=?, email=?, age=? WHERE id=?";
    
    db.query(sql, [name, email, age, id], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        res.json({ message: "Student updated" });
    });
});


router.delete("/:id", (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM students WHERE id=?";
    
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        res.json({ message: "Student deleted" });
    });
});

module.exports = router;