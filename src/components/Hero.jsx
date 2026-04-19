import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Hero.css';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <div className="hero-background"></div>
      <div className="hero-overlay"></div>
      
      <div className="hero-content">
        <div className="hero-content-padding" style={{height: '10%'}}></div>
        <main className="hero-body">
          <div className="hero-title-wrapper">
             <h1 className="hero-title">Culinary<br/><span>Transcendence</span></h1>
          </div>
          <p className="hero-subtitle">An immersive dining experience where every shadow reveals a flavor and every detail is an intentional craft.</p>
          <div className="hero-actions" style={{marginTop: '2rem'}}>
             <button className="btn-primary" onClick={() => navigate('/reservations')}>Reserve a Table</button>
          </div>
        </main>
        
        <footer className="hero-footer">
          <div className="location">
            <span>EST. 2026 // NEW YORK</span>
          </div>
          <div className="scroll-indicator">Scroll to Explore</div>
        </footer>
      </div>
    </section>
  );
}
