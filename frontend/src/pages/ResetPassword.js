import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null); // { text: '', type: 'success' | 'error' }
  const [isDisabled, setIsDisabled] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setIsDisabled(true);
    setMessage(null);

    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/email/reset/${token}`, {
        password,
      });
      setMessage({ text: 'Password reset successful. Redirecting to login...', type: 'success' });

      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      const msg = err.response?.data?.message || 'Reset failed. Try again.';
      setMessage({ text: msg, type: 'error' });
    }

    setTimeout(() => setIsDisabled(false), 3000);
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleReset} style={styles.form}>
        <h2 style={styles.heading}>Reset Password</h2>

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

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New Password"
          required
          minLength={6}
          style={styles.input}
        />

        <button
          type="submit"
          style={{ ...styles.button, opacity: isDisabled ? 0.6 : 1 }}
          disabled={isDisabled}
        >
          {isDisabled ? 'Please wait...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: '#f7f7f7',
  },
  form: {
    background: '#fff',
    padding: '30px 40px',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    minWidth: '300px',
  },
  heading: {
    marginBottom: '20px',
    fontSize: '24px',
    textAlign: 'center',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  button: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
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

export default ResetPassword;