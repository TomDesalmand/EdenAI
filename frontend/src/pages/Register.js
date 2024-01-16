import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
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

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch('http://localhost:8000/api/register', {
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
          setNotification('Registration successful!');
          navigate('/');
        }
      })
      .catch((error) => {
        console.error('Error during register:', error);
        setNotification('Registration failed. Please try again.');
      });
  };

  return (
    <div className="registration-container">
      <div className="form-container">
        <h2>Registration</h2>
        {notification && (
          <div className="notification">{notification}</div>
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

          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="input-field"
            />
          </label>

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
          <li onClick={() => navigate(`/login`)}>back to login</li>
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;