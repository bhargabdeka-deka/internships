import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/users/login', formData);
      localStorage.setItem('token', res.data.token);

      toast.success('✅ Login successful!', {
        position: 'top-center',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false
      });

      setTimeout(() => navigate('/home'), 2000); // Navigate after 2s
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Try again!', {
        position: 'top-center',
        autoClose: 3000
      });
    }
  };

  return (
    <div className="login-container">
      <h2>🔐 Log In to Your Account</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          name="email"
          placeholder="📧 Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="🔑 Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Log In</button>
      </form>
      <p>Don’t have an account? <span onClick={() => navigate('/signup')}>Sign up here</span></p>
      <ToastContainer />
    </div>
  );
}

export default Login;