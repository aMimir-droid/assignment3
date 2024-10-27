import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddStudent = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullname: "",
        profilePicture: "",
        address: "",
        phoneNumber: "",
        birthDate: "",
        gender:"",
        programStudy: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const facultyMap = {
            'Ekonomi': 'Fakultas Ekonomi',
            'Manajemen': 'Fakultas Ekonomi',
            'Akuntansi': 'Fakultas Ekonomi',
            'Administrasi Publik': 'Fakultas Ilmu Sosial dan Politik',
            'Administrasi Bisnis': 'Fakultas Ilmu Sosial dan Politik',
            'Hubungan Internasional': 'Fakultas Ilmu Sosial dan Politik',
            'Teknik Sipil': 'Fakultas Teknik',
            'Arsitektur': 'Fakultas Teknik',
            'Matematika': 'Fakultas Teknologi Informasi dan Sains',
            'Fisika': 'Fakultas Teknologi Informasi dan Sains',
            'Informatika': 'Fakultas Teknologi Informasi dan Sains',
        };

        const faculty = facultyMap[formData.programStudy];

        const studentData = {
            ...formData,
            faculty,
        };

        try {
            await fetch(`http://localhost:3001/student`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(studentData),
            });
            navigate('/student');
        } catch (error) {
            console.log('Error adding student data:', error);
        }
    };


    return (
        <div className="ContainerForm">
        <form onSubmit={handleSubmit}>
            <div>
                <label>Fullname
                <input
                    type="text"
                    name="fullname"
                    data-testid="name"
                    value={formData.fullname}
                    onChange={handleChange}
                    required
                />
                </label>
            </div>
            <div>
                <label>Profile Picture
                <input
                    type="text"
                    name="profilePicture"
                    data-testid="profilePicture"
                    value={formData.profilePicture}
                    onChange={handleChange}
                    required
                />
                </label>
            </div>
            <div>
                <label>Address
                <input
                    type="text"
                    name="address"
                    data-testid="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                />
                </label>
            </div>
            <div>
                <label>Phone Number
                <input
                    type="text"
                    name="phoneNumber"
                    data-testid="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                />
                </label>
            </div>
            <div>
                <label>Birth Date
                <input
                    type="date"
                    name="birthDate"
                    data-testid="date"
                    value={formData.birthDate}
                    onChange={handleChange}
                    required
                />
                </label>
            </div>
            <div>
                <label>Gender
                <select
                    name="gender"
                    data-testid="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>
                </label>
                </div>
                <div>
                <label>Program Study
                <select
                    name="programStudy"
                    data-testid="prody"
                    value={formData.programStudy}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Program Study</option>
                    <option value="Ekonomi">Ekonomi</option>
                    <option value="Manajemen">Manajemen</option>
                    <option value="Akuntansi">Akuntansi</option>
                    <option value="Administrasi Publik">Administrasi Publik</option>
                    <option value="Administrasi Bisnis">Administrasi Bisnis</option>
                    <option value="Hubungan Internasional">Hubungan Internasional</option>
                    <option value="Teknik Sipil">Teknik Sipil</option>
                    <option value="Arsitektur">Arsitektur</option>
                    <option value="Matematika">Matematika</option>
                    <option value="Fisika">Fisika</option>
                    <option value="Informatika">Informatika</option>
                </select>
                </label>
            </div>
            <button type="submit" className="add-button" data-testid="add-btn">Add Student</button>
        </form>
        </div>
    );
};

export default AddStudent;
