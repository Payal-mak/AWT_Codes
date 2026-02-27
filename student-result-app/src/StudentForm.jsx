import { useState } from "react";

function StudentForm({ addStudent }) {

    const [name, setName] = useState("");
    const [roll, setRoll] = useState("");
    const [daa, setDaa] = useState("");
    const [awt, setAwt] = useState("");
    const [se, setSe] = useState("");
    const [ot, setOt] = useState("");
    const [dl, setDl] = useState("");

    const handleSubmit = () => {

        if (!name || !roll || !daa || !awt || !se || !ot || !dl) {
            alert("Fill all fields");
            return;
        }

        const total =
            Number(daa) +
            Number(awt) +
            Number(se) +
            Number(ot) +
            Number(dl);

        const percentage = ((total / 500) * 100).toFixed(2);

        const newStudent = {
            name,
            roll,
            daa,
            awt,
            se,
            ot,
            dl,
            total,
            percentage
        };

        addStudent(newStudent);

        setName("");
        setRoll("");
        setDaa("");
        setAwt("");
        setSe("");
        setOt("");
        setDl("");
    };

    const rowStyle = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: "10px",
        gap: "10px"
    };

    return (
        <div>
            <h3>Add Student</h3>

            <div style={rowStyle}>
                <label style={{ width: "120px", textAlign: "right" }}>Name:</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>

            <div style={rowStyle}>
                <label style={{ width: "120px", textAlign: "right" }}>Roll No:</label>
                <input
                    type="text"
                    value={roll}
                    onChange={(e) => setRoll(e.target.value)}
                />
            </div>

            <div style={rowStyle}>
                <label style={{ width: "120px", textAlign: "right" }}>DAA Marks:</label>
                <input
                    type="number"
                    value={daa}
                    onChange={(e) => setDaa(e.target.value)}
                />
            </div>

            <div style={rowStyle}>
                <label style={{ width: "120px", textAlign: "right" }}>AWT Marks:</label>
                <input
                    type="number"
                    value={awt}
                    onChange={(e) => setAwt(e.target.value)}
                />
            </div>

            <div style={rowStyle}>
                <label style={{ width: "120px", textAlign: "right" }}>SE Marks:</label>
                <input
                    type="number"
                    value={se}
                    onChange={(e) => setSe(e.target.value)}
                />
            </div>

            <div style={rowStyle}>
                <label style={{ width: "120px", textAlign: "right" }}>OT Marks:</label>
                <input
                    type="number"
                    value={ot}
                    onChange={(e) => setOt(e.target.value)}
                />
            </div>

            <div style={rowStyle}>
                <label style={{ width: "120px", textAlign: "right" }}>DL Marks:</label>
                <input
                    type="number"
                    value={dl}
                    onChange={(e) => setDl(e.target.value)}
                />
            </div>

            <div style={{ textAlign: "center", marginTop: "15px" }}>
                <button onClick={handleSubmit}>Add Student</button>
            </div>
        </div>
    );
}

export default StudentForm;