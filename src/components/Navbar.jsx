import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
    return (
        <nav>
            <ul>
                <li><Link to="/" data-testid="home-page">Home</Link></li>
                <div className="link-group">
                <li><Link to="/student" data-testid="student-page">Students</Link></li>
                <li><Link to="/add" data-testid="add-page">Add Student</Link></li>
                </div>
            </ul>
        </nav>
    );
};

export default NavBar;