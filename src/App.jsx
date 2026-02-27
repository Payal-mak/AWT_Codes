import { useState } from "react";

function App() {

  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [roll, setRoll] = useState("");
  const [m1, setM1] = useState("");
  const [m2, setM2] = useState("");
  const [m3, setM3] = useState("");

  const addStudent = () => {

    if (!name || !roll || !m1 || !m2 || !m3) {
      alert("Fill all fields");
      return;
    }

    const total = Number(m1) + Number(m2) + Number(m3);
    const percentage = ((total / 300) * 100).toFixed(2);

    const newStudent = {
      name,
      roll,
      m1,
      m2,
      m3,
      total,
      percentage
    };

    setStudents([...students, newStudent]);

    setName("");
    setRoll("");
    setM1("");
    setM2("");
    setM3("");
  };

  const deleteStudent = (index) => {
    const updated = students.filter((_, i) => i !== index);
    setStudents(updated);
  };

  return (
    <div>
      <h2>Student Result Management</h2>

      <h3>Add Student</h3>

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br /><br />

      <input
        type="text"
        placeholder="Roll No"
        value={roll}
        onChange={(e) => setRoll(e.target.value)}
      />
      <br /><br />

      <input
        type="number"
        placeholder="Marks 1"
        value={m1}
        onChange={(e) => setM1(e.target.value)}
      />
      <br /><br />

      <input
        type="number"
        placeholder="Marks 2"
        value={m2}
        onChange={(e) => setM2(e.target.value)}
      />
      <br /><br />

      <input
        type="number"
        placeholder="Marks 3"
        value={m3}
        onChange={(e) => setM3(e.target.value)}
      />
      <br /><br />

      <button onClick={addStudent}>Add Student</button>

      <hr />

      <h3>Student List</h3>

      <table border="1">
        <thead>
          <tr>
            <th>Name</th>
            <th>Roll</th>
            <th>M1</th>
            <th>M2</th>
            <th>M3</th>
            <th>Total</th>
            <th>Percentage</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {students.map((s, index) => (
            <tr key={index}>
              <td>{s.name}</td>
              <td>{s.roll}</td>
              <td>{s.m1}</td>
              <td>{s.m2}</td>
              <td>{s.m3}</td>
              <td>{s.total}</td>
              <td>{s.percentage}%</td>
              <td>
                <button onClick={() => deleteStudent(index)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

export default App;