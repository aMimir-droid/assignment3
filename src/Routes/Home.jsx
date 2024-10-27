import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    const handleButtonClick = () => {
        navigate('/student');
    };

    return (
        <div style={styles.container}>
            <div style={styles.overlay}>
                <div style={styles.textBox}>
                    <h1 style={styles.mainText}>Assigntment Student Portal 3</h1>
                    <p style={styles.subText}>by Septian Dwi Saputra</p>
                </div>
                <button 
                    data-testid="student-btn" 
                    onClick={handleButtonClick}
                    style={styles.button}
                >
                    All Student
                </button>
            </div>
        </div>
    );
};

const styles = {
    container: {
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%',
        height: '100%',
        backgroundImage: 'url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmjlUtq8jncV1I1bIQaA5tU2XDBIrzv6RqHg&s)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden', 
        backgroundColor: 'gray', 
    },
    overlay: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 128, 128, 0.7)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
    },
    textBox: {
        textAlign: 'center',
        color: 'white',
        marginBottom: '20px',
    },
    mainText: {
        fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', 
        fontWeight: 'bold',
    }, subText: {
        fontSize: 'clamp(1rem, 3vw, 1.2rem)', 
        color: '#ddd',
    },
    button: {
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
        backgroundColor: '#333',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        marginTop: '10px',
    },
};

export default Home;