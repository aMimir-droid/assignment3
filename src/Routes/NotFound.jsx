import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1 style={{ fontSize: '2em', color: '#ff0000' }}>404 | Not Found</h1>
            <button 
                data-testid="back" 
                onClick={() => navigate ("/")} 
                style={{ marginTop: '20px', padding: '10px 20px', fontSize: '1em', cursor: 'pointer' }}
            >
                Go Back
            </button>
        </div>
    );
};

export default NotFound;
