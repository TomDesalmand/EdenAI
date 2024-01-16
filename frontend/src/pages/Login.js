import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (notification) {
      const timeoutId = setTimeout(() => {
        setNotification(null);
      }, 3000);

      return () => clearTimeout(timeoutId);
    }
  }, [notification]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogin = () => {
    fetch('http://localhost:8000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.access_token) {
          localStorage.setItem('token', data.access_token);
          navigate('/');
        } else {
          setNotification('Login failed. Please check your credentials.');
        }
      })
      .catch((error) => {
        console.error('Error during login:', error);
        setNotification('Login failed. Please try again.');
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleLogin();
  };

  return (
    <div className="login-container">
      <div className="form-container">
        <h2>Login</h2>
        {notification && (
          <div
            className="notification"
            style={{ opacity: 1, transition: 'opacity 0.5s ease-out' }}
          >
            {notification}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <label>
            Username:
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="input-field"
            />
          </label>
          <br />
          <label>
            Password:
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="input-field"
            />
          </label>
          <br />
          <li onClick={() => navigate(`/register`)}>Register?</li>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
