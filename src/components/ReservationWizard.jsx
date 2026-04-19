import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ReservationWizard.css';

const TIME_SLOTS = ["6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM"];

const renderTable = (type, key, idStr, orient, isSelectable, isSelected, onTableClick) => {
  const numChairs = type === 't2' ? 1 : type === 't4' ? 2 : type === 't6' ? 3 : 4;
  const chairs1 = [...Array(numChairs)].map((_, i) => <div key={`1-${i}`} className="fp-chair"></div>);
  const chairs2 = [...Array(numChairs)].map((_, i) => <div key={`2-${i}`} className="fp-chair"></div>);
  return (
    <div 
      key={key} 
      className={`fp-table-group ${type} orient-${orient || 'v'} ${isSelectable ? 'is-selectable' : ''} ${isSelected ? 'is-selected' : ''}`}
      onClick={() => isSelectable && onTableClick(idStr)}
    >
      <div className={`fp-chairs ${orient === 'h' ? 'top' : 'left'}`}>{chairs1}</div>
      <div className="fp-table"></div>
      <div className={`fp-chairs ${orient === 'h' ? 'bottom' : 'right'}`}>{chairs2}</div>
    </div>
  );
};

export default function ReservationWizard() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    guests: null,
    time: null,
    table: null,
    zoneIndex: 0,
    specificTable: [],
    name: ''
  });

  const handleNext = () => setStep(s => s + 1);
  const handlePrev = () => setStep(s => Math.max(1, s - 1));

  const selectGuests = (count) => {
    let suggestedTable = "";
    let zoneIdx = 0;
    
    if (count <= 2) {
      suggestedTable = "Two Person Zone (Center-Left)";
      zoneIdx = 0;
    } else if (count <= 4) {
      suggestedTable = "Four Person Zone (Left & Center-Right)";
      zoneIdx = 1;
    } else if (count <= 6) {
      suggestedTable = "Six Person Zone (Right)";
      zoneIdx = 2;
    } else {
      suggestedTable = "Eight Person Zone (Far Right)";
      zoneIdx = 3;
    }

    setFormData({ ...formData, guests: count, table: suggestedTable, zoneIndex: zoneIdx, specificTable: [] });
    handleNext();
  };

  const handleTableSelect = (id) => {
    if (formData.guests === 8 || formData.guests === '10+') {
      // Multiple selection
      setFormData(prev => {
         const current = Array.isArray(prev.specificTable) ? prev.specificTable : [];
         if (current.includes(id)) {
            return { ...prev, specificTable: current.filter(x => x !== id) };
         }
         return { ...prev, specificTable: [...current, id] };
      });
    } else {
      // Single selection
      setFormData({ ...formData, specificTable: [id] });
    }
  };

  const buildTable = (type, i, prefix, orient, reqZoneIndex) => {
    const idStr = `${prefix}-${i + 1}`;
    // If party is 8 or more, all tables are selectable to combine!
    const isSelectable = (formData.guests === 8 || formData.guests === '10+') ? true : formData.zoneIndex === reqZoneIndex;
    const isSelected = Array.isArray(formData.specificTable) && formData.specificTable.includes(idStr);
    return renderTable(type, i, idStr, orient, isSelectable, isSelected, handleTableSelect);
  };

  const selectTime = (time) => {
    setFormData({ ...formData, time });
    handleNext();
  };

  const confirmReservation = async () => {
    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guests: formData.guests,
          time: formData.time,
          table: formData.table,
          specificTable: formData.specificTable.join(', '),
          name: formData.name || 'Guest'
        })
      });
      if (response.ok) {
        alert("Deposit Initialized & Table Blocked for 90 Minutes!");
        // Reset or move to success step can be done here
        setStep(1);
      } else {
        alert("Failed to secure table. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while confirming reservation.");
    }
  };

  return (
    <section id="reservations" className="reservation-section">
      <div className="glass-card">
        <h2 className="reservation-title">Secure Your Experience</h2>
        
        <div className="wizard-container">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
               key="step1" 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.95 }}
               transition={{ duration: 0.4 }}
               className="wizard-step"
              >
                <h3>How many guests?</h3>
                <div className="guest-grid">
                  {[1, 2, 3, 4, 5, 6, 7, '8+'].map(num => (
                    <button key={num} onClick={() => selectGuests(num === '8+' ? 8 : num)} className="guest-btn">
                      {num}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
               key="step2"
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.95 }}
               transition={{ duration: 0.4 }}
               className="wizard-step"
              >
                <h3>Curated Seating</h3>
                <p className="descriptor">Based on your party of {formData.guests}, we have allocated an exclusive zone.<br/><strong>Please tap a table to book it.</strong></p>
                <div className="table-highlight-box floor-plan-box">
                  <span className="zone-name">{formData.table}</span>
                  <div className="floor-plan-wrapper">
                    
                    <div className="fp-top-wall">
                      <div className="fp-room">Kitchen</div>
                      <div className="fp-room">Washroom & Hand wash</div>
                      <div className="fp-room">Reception</div>
                      <div className="fp-entry">&larr; Entry</div>
                    </div>
                    
                    <div className="fp-upper-zone">
                      {/* Left Part */}
                      <div className="fp-room-half">
                        {/* Column 1: 4 Person Tables */}
                        <div className={`fp-column ${formData.zoneIndex === 1 ? 'glow-zone' : ''}`}>
                          <div className="fp-col-label">4 Person</div>
                          <div className="fp-tables-grid">
                            {[...Array(8)].map((_,i) => buildTable('t4', i, '4pL', 'v', 1))}
                          </div>
                        </div>

                        {/* Column 2: 2 Person Tables */}
                        <div className={`fp-column ${formData.zoneIndex === 0 ? 'glow-zone' : ''}`}>
                          <div className="fp-col-label">2 Person</div>
                          <div className="fp-tables-grid">
                            {[...Array(8)].map((_,i) => buildTable('t2', i, '2pL', 'v', 0))}
                          </div>
                        </div>
                      </div>

                      {/* Center Divider: Decoration */}
                      <div className="fp-center-divider">
                          <span className="fp-flower-vertical">Decoration<br/>Flower</span>
                      </div>

                      {/* Right Part */}
                      <div className="fp-room-half">
                        {/* Column 3: 4 Person Tables */}
                        <div className={`fp-column ${formData.zoneIndex === 1 ? 'glow-zone' : ''}`}>
                          <div className="fp-col-label">4 Person</div>
                          <div className="fp-tables-grid">
                            {[...Array(8)].map((_,i) => buildTable('t4', i, '4pR', 'v', 1))}
                          </div>
                        </div>

                        {/* Column 4: 6 Person Tables */}
                        <div className={`fp-column ${formData.zoneIndex === 2 ? 'glow-zone' : ''}`}>
                          <div className="fp-col-label">6 Person</div>
                          <div className="fp-tables-grid">
                            {[...Array(8)].map((_,i) => buildTable('t6', i, '6pR', 'v', 2))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom row: 8 Person tables */}
                    <div className="fp-bottom-zone">
                       <div className={`fp-row ${formData.zoneIndex === 3 ? 'glow-zone' : ''}`}>
                         <span className="fp-row-label">8 Person Floor Section</span>
                         <div className="fp-tables-horizontal">
                            {[...Array(5)].map((_,i) => buildTable('t8', i, '8pB', 'h', 3))}
                         </div>
                       </div>
                    </div>

                  </div>
                </div>
                <div className="step-actions">
                  <button className="back-btn" onClick={handlePrev}>← Back</button>
                  <button 
                    className="action-btn" 
                    onClick={handleNext}
                    style={{ opacity: formData.specificTable?.length > 0 ? 1 : 0.5 }}
                    disabled={!formData.specificTable?.length}
                  >
                    {formData.specificTable?.length > 0 ? 'Confirm Seating' : 'Select a Table'}
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
               key="step3"
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.95 }}
               transition={{ duration: 0.4 }}
               className="wizard-step"
              >
                <h3>Select Arrival Time</h3>
                <p className="descriptor">Reserving a strict 90-minute dining experience limit.</p>
                <div className="time-grid">
                  {TIME_SLOTS.map(t => (
                    <button key={t} onClick={() => selectTime(t)} className="time-btn">{t}</button>
                  ))}
                </div>
                <button className="back-btn" onClick={handlePrev}>← Back</button>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div 
               key="step4"
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.95 }}
               transition={{ duration: 0.4 }}
               className="wizard-step"
              >
                <h3>Finalize Reservation</h3>
                <div className="name-input-group">
                  <input 
                    type="text" 
                    placeholder="Enter Booking Name (e.g., Harsh)" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="reservation-name-input"
                  />
                </div>
                <div className="summary-box">
                  <p><strong>Guests:</strong> <span>{formData.guests}</span></p>
                  <p><strong>Time:</strong> <span>{formData.time} (90 Min Block)</span></p>
                  <p><strong>Table ID(s):</strong> <span>{formData.specificTable?.join(', ')}</span></p>
                </div>
                <div className="payment-box">
                  <p>A deposit of <strong>₹100</strong> is required to secure this table.</p>
                  <button className="action-btn" onClick={confirmReservation}>Pay ₹100 Deposit</button>
                </div>
                <button className="back-btn" onClick={handlePrev}>← Back</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
