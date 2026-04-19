import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf } from 'lucide-react';
import './MenuGrid.css';

const CATEGORIES = ['All', 'Punjabi', 'Rajasthani', 'South Indian', 'Chinese'];

export default function MenuGrid() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/menu')
      .then(res => res.json())
      .then(data => {
        setMenuData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load menu:', err);
        setLoading(false);
      });
  }, []);

  const filteredItems = useMemo(() => {
    if (activeCategory === 'All') return menuData;
    return menuData.filter(item => item.category === activeCategory);
  }, [activeCategory, menuData]);

  return (
    <section className="menu-section" id="menu">
      <div className="menu-container">
        
        {/* Category Filter */}
        <div className="category-filter-bar">
          {CATEGORIES.map(category => (
            <button
              key={category}
              className={`category-btn ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
              {activeCategory === category && (
                <motion.div layoutId="underline" className="active-underline" />
              )}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <motion.div layout className="menu-grid">
          <AnimatePresence mode="popLayout">
            {filteredItems.map(item => {
              // Create dynamic class namespace for styling
              const catClass = item.category.toLowerCase().replace(' ', '-');
              
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -20 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className={`menu-card ${catClass}`}
                >
                  {/* Rajasthani specific subtle mandala background implemented via inline SVG */}
                  {item.category === 'Rajasthani' && (
                    <div className="rajasthani-mandala">
                       <svg viewBox="0 0 100 100" opacity="0.05" width="100%" height="100%" style={{position:'absolute', top: 0, left: 0}}>
                          <circle cx="50" cy="50" r="40" stroke="#c9a776" strokeWidth="2" fill="none" />
                          <circle cx="50" cy="50" r="30" stroke="#c9a776" strokeWidth="1" strokeDasharray="4 4" fill="none" />
                          <path d="M 50 10 L 55 20 L 50 30 L 45 20 Z" fill="#c9a776" />
                          <path d="M 50 90 L 55 80 L 50 70 L 45 80 Z" fill="#c9a776" />
                          <path d="M 10 50 L 20 45 L 30 50 L 20 55 Z" fill="#c9a776" />
                          <path d="M 90 50 L 80 45 L 70 50 L 80 55 Z" fill="#c9a776" />
                       </svg>
                    </div>
                  )}

                  <div className="card-content">
                    {/* South Indian Specific Iconography */}
                    {item.category === 'South Indian' && (
                      <div className="south-indian-icon">
                        <Leaf size={18} strokeWidth={1}/>
                      </div>
                    )}

                    <div className="card-header">
                       <h3 className="card-title">{item.name}</h3>
                       <span className="card-price">₹{item.price}</span>
                    </div>
                    <p className="card-description">{item.description}</p>
                    
                    {/* Chinese sleek accent line */}
                    {item.category === 'Chinese' && <div className="chinese-accent-line" />}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
