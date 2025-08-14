import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function VerifyEmail() {
  const { token } = useParams();
  const [message, setMessage] = useState(null); // { text: '', type: 'success' | 'error' }

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/auth/verify/${token}`);
        setMessage({ text: res.data.msg || 'Email verified successfully!', type: 'success' });
      } catch (err) {
        const errorMsg = err.response?.data?.msg || 'Verification failed. Link may have expired.';
        setMessage({ text: errorMsg, type: 'error' });
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div style={styles.container}>
      <div
        style={{
          ...styles.message,
          backgroundColor: message?.type === 'success' ? '#d4edda' : '#f8d7da',
          color: message?.type === 'success' ? '#155724' : '#721c24',
          borderColor: message?.type === 'success' ? '#c3e6cb' : '#f5c6cb',
        }}
      >
        {message?.text}
      </div>
      {message?.type === 'success' && (
        <div style={{ marginTop: '1.5rem' }}>
          <Link to="/login" style={styles.link}>Go to Login</Link>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '450px',
    margin: 'auto',
    marginTop: '4rem',
    padding: '2rem',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#fff',
    textAlign: 'center',
  },
  message: {
    padding: '1rem',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid',
  },
  link: {
    marginTop: '1rem',
    display: 'inline-block',
    padding: '10px 20px',
    backgroundColor: '#1976d2',
    color: '#fff',
    borderRadius: '5px',
    textDecoration: 'none',
  },
};

export default VerifyEmail;