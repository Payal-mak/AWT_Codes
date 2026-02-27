import { useState } from "react";
import StudentForm from "./StudentForm";
import StudentTable from "./StudentTable";

function App() {

  const [students, setStudents] = useState([]);

  const addStudent = (student) => {
    setStudents([...students, student]);
  };

  const deleteStudent = (index) => {
    const updated = students.filter((_, i) => i !== index);
    setStudents(updated);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Student Result Management</h2>

      <StudentForm addStudent={addStudent} />

      <hr />

      <StudentTable students={students} deleteStudent={deleteStudent} />
    </div>
  );
}

export default App;