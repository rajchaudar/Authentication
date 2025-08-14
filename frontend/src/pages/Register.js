import React, { useState } from 'react';
import axios from 'axios';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null); // { text: '', type: 'success' | 'error' }
  const [isDisabled, setIsDisabled] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage(null);
    setIsDisabled(true);

    try {
      await api.post('/api/auth/register', { email, password });
      setMessage({ text: 'Registration successful! Redirecting to login...', type: 'success' });

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      setMessage({ text: msg, type: 'error' });
    }

    setTimeout(() => setIsDisabled(false), 3000);
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <div style={styles.container}>
        <h2 style={styles.heading}>Register</h2>

        {message && (
          <div
            style={{
              ...styles.message,
              backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
              color: message.type === 'success' ? '#155724' : '#721c24',
              borderColor: message.type === 'success' ? '#c3e6cb' : '#f5c6cb',
            }}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div style={styles.inputGroup}>
            <label>Email</label><br />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              required
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label>Password</label><br />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              style={styles.input}
            />
          </div>
          <button
            type="submit"
            style={{ ...styles.button, opacity: isDisabled ? 0.6 : 1 }}
            disabled={isDisabled}
          >
            {isDisabled ? 'Please wait...' : 'Register'}
          </button>
        </form>

        <div style={styles.google}>
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/oauth/google`, {
                  token: credentialResponse.credential,
                });
                const { accessToken, refreshToken } = res.data;
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);
                navigate('/dashboard');
              } catch (err) {
                setMessage({ text: 'Google login failed.', type: 'error' });
              }
            }}
            onError={() => setMessage({ text: 'Google login failed.', type: 'error' })}
          />
        </div>

        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <Link to="/login">Already have an account? Login</Link>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

const styles = {
  container: {
    maxWidth: '400px',
    margin: 'auto',
    padding: '2rem',
    border: '1px solid #ccc',
    borderRadius: '10px',
    backgroundColor: '#fff',
    marginTop: '3rem',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '1rem',
  },
  inputGroup: {
    marginBottom: '1rem',
  },
  input: {
    width: '100%',
    padding: '8px',
    fontSize: '14px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  button: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    backgroundColor: '#1976d2',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  google: {
    margin: '1rem 0',
    display: 'flex',
    justifyContent: 'center',
  },
  message: {
    padding: '10px',
    marginBottom: '15px',
    border: '1px solid',
    borderRadius: '5px',
    fontSize: '14px',
    textAlign: 'center',
  },
};

export default Register;