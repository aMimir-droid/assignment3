import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    const handleButtonClick = () => {
        navigate('/student');
    };

    return (
        <div>
            <Button 
                    data-testid="student-btn" 
                    onClick={handleButtonClick}>
                    All Student
                </Button>
            </div>
    );
};


export default Home;
