import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  return (
    <header className="global-navbar">
       <div className="logo"><Link to="/">AURA</Link></div>
       <nav className="nav-links">
         <Link to="/menu">Menu</Link>
         <Link to="/reservations">Reservations</Link>
         <Link to="/admin">Admin</Link>
       </nav>
    </header>
  );
}
