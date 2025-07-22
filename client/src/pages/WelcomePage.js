import React from 'react';
import { useNavigate } from 'react-router-dom';
import './WelcomePage.css';

function WelcomePage() {
  const navigate = useNavigate();
  console.log("WelcomePage rendered");


  return (
    <div className="welcome-container">
      <header className="welcome-header">
        <h1>⚡ Smart Electricity Portal</h1>
        <p className="tagline">Lighting Lives. Powering Futures.</p>
      </header>

      <section className="quotes-section">
        <blockquote>
          “Electricity is not just power — it’s opportunity.”
        </blockquote>
        <blockquote>
          “From homes to hospitals, energy empowers every step we take.”
        </blockquote>
        <div className="gov-steps">
          <h3>🔍 Government Initiatives</h3>
          <p>Assam’s Saubhagya Scheme has provided connections to over 5 lakh rural households.</p>
          <p>The APDCL Smart Grid Initiative is transforming energy access across the state.</p>
        </div>
      </section>

      <div className="action-buttons">
        <button onClick={() => navigate('/signup')} className="btn btn-primary">Sign Up</button>
        <button onClick={() => navigate('/login')} className="btn btn-secondary">Log In</button>
      </div>
      
       <div className="welcome-container">
    {/* <h2>👋 Welcome Page Loaded</h2> */}
    {/* Rest of your content */}
    </div>

    </div>
       
  );
}

export default WelcomePage;