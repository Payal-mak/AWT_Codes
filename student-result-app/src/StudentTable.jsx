function StudentTable({ students, deleteStudent }) {

    return (
        <div>
            <h3>Student List</h3>

            <table border="1" style={{ margin: "auto" }}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Roll</th>
                        <th>DAA</th>
                        <th>AWT</th>
                        <th>SE</th>
                        <th>OT</th>
                        <th>DL</th>
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
                            <td>{s.daa}</td>
                            <td>{s.awt}</td>
                            <td>{s.se}</td>
                            <td>{s.ot}</td>
                            <td>{s.dl}</td>
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

export default StudentTable;