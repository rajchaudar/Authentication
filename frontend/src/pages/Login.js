import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null); // { text: '', type: 'success' | 'error' }
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();
  setMessage(null);
  setLoading(true);

  try {
    const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/login`, {
      email,
      password,
    });

    const { accessToken, refreshToken } = res.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setMessage({ text: 'Login successful. Redirecting...', type: 'success' });

    setTimeout(() => navigate('/dashboard'), 1500);
  } catch (err) {
    const backendMsg = err.response?.data?.msg;

    if (backendMsg === 'Invalid credentials') {
  setMessage({ text: 'Invalid email or password.', type: 'error' });
} else if (backendMsg === 'Email not verified') {
  setMessage({ text: 'Email not verified. Please check your inbox to verify your email.', type: 'error' });
} else {
  setMessage({ text: 'Something went wrong. Please try again.', type: 'error' });
}
  } finally {
    setLoading(false);
  }
};

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setMessage(null);

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/oauth/google`, {
        token: credentialResponse.credential,
      });

      const { accessToken, refreshToken } = res.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      setMessage({ text: 'Google login successful. Redirecting...', type: 'success' });

      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setMessage({ text: 'Google login failed. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <div style={styles.container}>
        <h2 style={styles.heading}>Login</h2>

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

        <form onSubmit={handleLogin}>
          <div style={styles.inputGroup}>
            <label>Email</label><br />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              required
              style={styles.input}
              disabled={loading}
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
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            style={{
              ...styles.button,
              backgroundColor: loading ? '#6c757d' : '#1976d2',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
            disabled={loading}
          >
            {loading ? 'Please wait...' : 'Login'}
          </button>
        </form>

        <div style={styles.google}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() =>
              setMessage({ text: 'Google login failed.', type: 'error' })
            }
            useOneTap
            text="signin_with"
            logo_alignment="center"
            disabled={loading}
          />
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link to="/forgot-password">Forgot Password?</Link> | <Link to="/register">Register</Link>
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
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
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

export default Login;