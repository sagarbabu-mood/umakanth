// src/components/Home/Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './index.css'; // Import the CSS specific to Home component

const Home = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleMoreClick = () => {
    navigate('/news'); // Navigate to the news page
  };

  const handleNoThanksClick = () => {
    // Add logic if needed, or leave it empty
    console.log("User chose not to proceed");
  };

  return (
    <div className="container">
      {/* Main content */}
      <div className="main-content">
        <div className='content-container'>
          <div>
            <h1 className="header-text">MORNING <span className="sub-text">NEWS</span></h1>
            <h2 className="sub-text">LANDING PAGES</h2>
            <p className="paragraph">
              Stay informed with the latest headlines that matter.<br />
              From global events to local updates, we've got you covered.<br />
              Discover insightful articles that shape your day.<br />
              Join us every morning for news that keeps you in the know!<br />
            </p>
            <button className="button" onClick={handleMoreClick}>MORE</button>
            <button className="button-secondary" onClick={handleNoThanksClick}>NO, THANKS</button>
          </div>

          <div className="illustration">
            <img 
              src="https://img.freepik.com/free-vector/news-concept-landing-page_52683-20167.jpg" 
              alt="News Illustration" 
              className="image" 
              onError={(e) => { e.target.onerror = null; e.target.src = "fallback-image-url.jpg"; }} // Handle image error
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
