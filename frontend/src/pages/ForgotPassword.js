import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null); // { text: '', type: 'success' | 'error' }
  const [isDisabled, setIsDisabled] = useState(false);

  const handleForgot = async (e) => {
    e.preventDefault();
    setIsDisabled(true); // Disable button during request
    setMessage(null);

    try {
        await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/email/forgot-password`, {
        email: email.trim(),
      });

      setMessage({ text: 'Reset link sent to email.', type: 'success' });
    } catch (err) {
      const backendMsg = err.response?.data?.msg || '';

      if (backendMsg === 'User not found') {
        setMessage({ text: 'Email not registered.', type: 'error' });
      } else {
        setMessage({ text: 'Something went wrong. Please try again.', type: 'error' });
      }

      console.error(err);
    }

    // Re-enable button and reset form after 4 seconds
    setTimeout(() => {
      setIsDisabled(false);
      setEmail('');
      setMessage(null);
    }, 4000);
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleForgot} style={styles.form}>
        <h2 style={styles.heading}>Forgot Password</h2>

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
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
          required
          style={styles.input}
        />

        <button
          type="submit"
          style={{ ...styles.button, opacity: isDisabled ? 0.6 : 1 }}
          disabled={isDisabled}
        >
          {isDisabled ? 'Please wait...' : 'Send Reset Link'}
        </button>
        <Link to="/login" style={{ display: 'block', textAlign: 'center', marginTop: '15px' }}>
          Back to Login
        </Link>
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
    backgroundColor: '#007bff',
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

export default ForgotPassword;