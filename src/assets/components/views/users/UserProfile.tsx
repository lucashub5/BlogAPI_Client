import React, { useEffect, useState } from 'react';
import { formatDate } from '../../../formatDate';

interface User {
    firstName: string;
    lastName: string;
    email: string;
    creationDate: string;
    isAdmin: boolean;
}

const UserProfile: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/user_profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
    
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
    
                const data = await response.json();
                setUser(data);
            } catch (error) {
                console.error('Error fetching user profile:', error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchUserProfile();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    };

    return (
        <div className="profile-container">
            {loading ? (
                <div className="loading-overlay">
                    <div className="spinner"></div>
                </div>
            ) : !user ? (
                <div className="profile-error">
                    <p>Error loading user profile.</p>
                    <button className="sign-button" onClick={handleLogout}>Logout</button>
                </div>
            ) : (
                <>
                    <h2>User Profile</h2>
                    <div className="user-details">
                        <p><strong>First Name:</strong> {user.firstName}</p>
                        <p><strong>Last Name:</strong> {user.lastName}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Start Date:</strong> {formatDate(user.creationDate)}</p>
                        <p><strong>Admin:</strong> {user.isAdmin ? "Yes" : "No"}</p>
                    </div>
                    <button className="sign-button" onClick={handleLogout}>Logout</button>
                </>
            )}
        </div>
    );
};

export default UserProfile;