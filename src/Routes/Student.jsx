import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Student = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await fetch('http://localhost:3001/student');
                const data = await response.json();
                setStudents(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching students:', error);
            }
        };

        fetchStudents();
    }, []);

    const handleDelete = async (id) => {
        try {
            await fetch(`http://localhost:3001/student/${id}`, { 
                method: 'DELETE' });
            setStudents(students.filter(student => student.id !== id));
        } catch (error) {
            console.error('Error deleting student:', error);
        }
    };

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    const filteredStudents = students.filter(student => {
        if (filter === 'All') {
            return true;
        }
        return student.faculty === filter;
    });

    if (loading) {
        return <p>Loading ...</p>;
    }

    return (
        <>
            <select data-testid="filter" className="Filter-select"onChange={handleFilterChange}>
                <option value="All">All</option>
                <option value="Fakultas Teknologi Informasi dan Sains">Fakultas Teknologi Informasi dan Sains</option>
                <option value="Fakultas Ekonomi">Fakultas Ekonomi</option>
                <option value="Fakultas Ilmu Sosial dan Politik">Fakultas Ilmu Sosial dan Politik</option>
                <option value="Fakultas Teknik">Fakultas Teknik</option>
            </select>
            <table id="table-student">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Fullname</th>
                        <th>Faculty</th>
                        <th>Program Study</th>
                        <th>Option</th>
                    </tr>
                </thead>
                <tbody>
                {filteredStudents.length > 0 ? (
                    filteredStudents.map((student, index) => (
                        <tr key={student.id} className="student-data-row">
                            <td>{index + 1}</td>
                            <td onClick={() => navigate(`/student/${student.id}`)}>{student.fullname}</td>
                            <td>{student.faculty}</td>
                            <td>{student.programStudy}</td>
                            <td>
                                <button
                                    className="delete-btn"
                                    type="button"
                                    data-testid={`delete-${student.id}`}
                                    onClick={() => handleDelete(student.id)}
                                >
                                Delete
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="5">No students found.</td>
                    </tr>
                )}
                </tbody>
            </table>
        </>
    );
};

export default Student;
