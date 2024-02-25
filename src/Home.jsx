import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css'

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Navigate to "/"
    navigate('/');
  };

  return (
    <div className='home'>
      <h1>Home</h1>
      <button onClick={handleLogout} className='logoutbtn'>Logout</button>
    </div>
  );
};

export default Home;