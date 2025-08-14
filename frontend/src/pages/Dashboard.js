import React, { useEffect, useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import '../styles/skeleton.css'; // Make sure this CSS file exists and is imported

function Dashboard() {
  const [user, setUser] = useState(null);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/api/dashboard');
        setUser(res.data.user);
        setMsg(res.data.msg);
      } catch (err) {
        console.error('Unauthorized or error:', err);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Dashboard</h1>

      {loading ? (
        <div style={styles.skeletonWrapper}>
          <div className="skeleton skeleton-text" />
          <div className="skeleton skeleton-subtext" />
          <div className="skeleton skeleton-button" />
        </div>
      ) : user ? (
        <div style={styles.card}>
          <p style={styles.message}>{msg}</p>
          <p><strong>User ID:</strong> {user.userId}</p>
          <button onClick={handleLogout} style={styles.button}>Logout</button>
        </div>
      ) : (
        <p>User data not available.</p>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '3rem auto',
    padding: '2rem',
    background: '#f9f9f9',
    borderRadius: '10px',
    textAlign: 'center',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
  },
  heading: {
    fontSize: '2rem',
    marginBottom: '1rem',
  },
  card: {
    background: '#fff',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
  },
  message: {
    color: '#28a745',
    fontWeight: 'bold',
    marginBottom: '1rem',
  },
  button: {
    marginTop: '1rem',
    padding: '10px 20px',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  skeletonWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    marginTop: '2rem',
  },
};

export default Dashboard;