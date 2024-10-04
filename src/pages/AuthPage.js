import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AuthPage.css'; // Assuming you will create a CSS file for styling
import loginUser from '../networkCalls/authService';
import Cookies from 'js-cookie';
import { AuthContext } from '../AuthContext';

const AuthPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setAuthToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await loginUser('test-username', 'password');
        console.log('Username:', response.username);
        console.log('Auth Token:', response.auth_token);
        setAuthToken(response.auth_token);
        // Save token to cookies
        Cookies.set('authToken', response.auth_token, { expires: 7 }); // Expires in 7 days
        navigate('/projects');
      // Handle successful login, e.g., save token, redirect, etc.
    } catch (error) {
      console.error('Error during login:', error);
      // Handle error
    }
  };

  return (
    <div className="auth-container">
      <h1>Login</h1>
      <div className="input-group">
        <label htmlFor="username">Username (Email)</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="input-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default AuthPage;