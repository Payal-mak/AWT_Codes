const db = require("../config/db");

// CREATE
exports.createStudent = (req, res) => {
  const { name, age, course } = req.body;

  const sql = "INSERT INTO students (name, age, course) VALUES (?, ?, ?)";
  db.query(sql, [name, age, course], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json({ message: "Student added", id: result.insertId });
  });
};

// READ
exports.getStudents = (req, res) => {
  const sql = "SELECT * FROM students";
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);

    res.json(result);
  });
};

// UPDATE
exports.updateStudent = (req, res) => {
  const { id } = req.params;
  const { name, age, course } = req.body;

  const sql =
    "UPDATE students SET name=?, age=?, course=? WHERE id=?";
  db.query(sql, [name, age, course, id], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json({ message: "Student updated" });
  });
};

// DELETE
exports.deleteStudent = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM students WHERE id=?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json({ message: "Student deleted" });
  });
};