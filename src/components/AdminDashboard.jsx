import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import './ReservationWizard.css'; // For floor plan styling
import { getApiUrl } from '../config/api';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('menu');
  const [reservations, setReservations] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loadingRes, setLoadingRes] = useState(false);
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [creds, setCreds] = useState({ user: '', pass: '' });
  const [editingDishId, setEditingDishId] = useState(null);

  const [newDish, setNewDish] = useState({
    category: 'Punjabi',
    name: '',
    price: '',
    description: ''
  });

  const readErrorMessage = async (res, fallback) => {
    try {
      const data = await res.json();
      return data?.error || data?.details || fallback;
    } catch {
      return fallback;
    }
  };

  const fetchMenu = async () => {
    try {
      const res = await fetch(getApiUrl('/api/menu'));
      setMenuItems(await res.json());
    } catch (err) { console.error(err); }
  };

  const fetchReservations = async () => {
    setLoadingRes(true);
    try {
      const res = await fetch(getApiUrl('/api/reservations'));
      const data = await res.json();
      setReservations(data);
    } catch (err) {
      console.error(err);
    }
    setLoadingRes(false);
  };

  useEffect(() => {
    if (activeTab === 'reservations') {
      fetchReservations();
    } else if (activeTab === 'menu') {
      fetchMenu();
    }
  }, [activeTab]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (creds.user === 'admin' && creds.pass === 'admin') {
      setIsAuthenticated(true);
      fetchMenu();
    } else {
      alert('Invalid admin credentials!');
    }
  };

  const getOccupiedTables = () => {
    const occupied = new Set();
    reservations.forEach(r => {
      if (r.status !== 'released' && r.specific_table) {
         r.specific_table.split(',').forEach(t => occupied.add(t.trim()));
      }
    });
    return occupied;
  };

  const occupiedSet = getOccupiedTables();

  const renderAdminTable = (type, key, idStr, orient) => {
    const isOccupied = occupiedSet.has(idStr);
    const numChairs = type === 't2' ? 1 : type === 't4' ? 2 : type === 't6' ? 3 : 4;
    const chairs1 = [...Array(numChairs)].map((_, i) => <div key={`1-${i}`} className="fp-chair"></div>);
    const chairs2 = [...Array(numChairs)].map((_, i) => <div key={`2-${i}`} className="fp-chair"></div>);

    const statusClass = isOccupied ? 'admin-table-occupied' : 'admin-table-free';

    return (
      <div key={key} className={`fp-table-group ${type} orient-${orient || 'v'} ${statusClass}`}>
        <div className={`fp-chairs ${orient === 'h' ? 'top' : 'left'}`}>{chairs1}</div>
        <div className="fp-table"></div>
        <div className={`fp-chairs ${orient === 'h' ? 'bottom' : 'right'}`}>{chairs2}</div>
      </div>
    );
  };

  const handleAddDish = async (e) => {
    e.preventDefault();
    if (editingDishId) {
      try {
        const res = await fetch(getApiUrl(`/api/menu/${editingDishId}`), {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newDish)
        });
        if (res.ok) {
          alert('Dish updated successfully!');
          setNewDish({ category: 'Punjabi', name: '', price: '', description: '' });
          setEditingDishId(null);
          fetchMenu();
        } else {
          alert(await readErrorMessage(res, 'Failed to update dish.'));
        }
      } catch (err) {
        console.error(err);
        alert('Error updating dish.');
      }
    } else {
      try {
        const res = await fetch(getApiUrl('/api/menu'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newDish)
        });
        if (res.ok) {
          alert('New dish added successfully!');
          setNewDish({ category: 'Punjabi', name: '', price: '', description: '' });
          fetchMenu();
        } else {
          alert(await readErrorMessage(res, 'Failed to add dish.'));
        }
      } catch (err) {
        console.error(err);
        alert('Error adding dish.');
      }
    }
  };

  const handleEditDish = (dish) => {
    setEditingDishId(dish.id);
    setNewDish({
      category: dish.category,
      name: dish.name,
      price: dish.price,
      description: dish.description || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteDish = async (id) => {
    if (!window.confirm("Are you sure you want to delete this dish?")) return;
    try {
      const res = await fetch(getApiUrl(`/api/menu/${id}`), {
        method: 'DELETE'
      });
      if (res.ok) {
        alert('Dish deleted!');
        fetchMenu();
      }
    } catch(err) {
      console.error(err);
    }
  };

  const handleReleaseTable = async (id) => {
    try {
      const res = await fetch(getApiUrl(`/api/reservations/${id}/release`), {
        method: 'PATCH'
      });
      if (res.ok) {
        alert('Table released successfully!');
        fetchReservations();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!isAuthenticated) {
    return (
      <section className="admin-container login-container">
        <div className="admin-login-card">
          <h2>Admin Login</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Username</label>
              <input type="text" value={creds.user} onChange={e => setCreds({...creds, user: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" value={creds.pass} onChange={e => setCreds({...creds, pass: e.target.value})} required />
            </div>
            <button type="submit" className="admin-submit-btn" style={{width: '100%'}}>Secure Login</button>
          </form>
        </div>
      </section>
    );
  }

  return (
    <section className="admin-container">
      <h2 className="admin-title">Admin Dashboard</h2>
      <div className="admin-tabs">
        <button className={`tab-btn ${activeTab === 'menu' ? 'active' : ''}`} onClick={() => setActiveTab('menu')}>Menu Management</button>
        <button className={`tab-btn ${activeTab === 'reservations' ? 'active' : ''}`} onClick={() => setActiveTab('reservations')}>Table Reservations</button>
      </div>

      <div className="admin-content">
        {activeTab === 'menu' && (
          <div className="admin-menu-card">
            <h3>{editingDishId ? 'Edit Dish' : 'Add New Dish'}</h3>
            <form onSubmit={handleAddDish}>
              <div className="form-group">
                <label>Category</label>
                <select value={newDish.category} onChange={e => setNewDish({...newDish, category: e.target.value})}>
                  <option value="Punjabi">Punjabi</option>
                  <option value="Rajasthani">Rajasthani</option>
                  <option value="South Indian">South Indian</option>
                  <option value="Chinese">Chinese</option>
                </select>
              </div>
              <div className="form-group">
                <label>Dish Name</label>
                <input type="text" value={newDish.name} onChange={e => setNewDish({...newDish, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Price (₹)</label>
                <input type="number" value={newDish.price} onChange={e => setNewDish({...newDish, price: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea rows="3" value={newDish.description} onChange={e => setNewDish({...newDish, description: e.target.value})}></textarea>
              </div>
              <button type="submit" className="admin-submit-btn">
                {editingDishId ? 'Update Dish' : 'Add to Menu'}
              </button>
              {editingDishId && (
                <button type="button" className="admin-submit-btn" style={{marginLeft: '10px', background: 'transparent', border: '1px solid var(--color-accent)', color: '#fff'}} onClick={() => {
                  setEditingDishId(null);
                  setNewDish({ category: 'Punjabi', name: '', price: '', description: '' });
                }}>Cancel Edit</button>
              )}
            </form>

            <h3 style={{marginTop: '40px'}}>Current Menu</h3>
            <table className="res-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Dish Name</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {menuItems.map(m => (
                  <tr key={m.id}>
                    <td>{m.category}</td>
                    <td>{m.name}</td>
                    <td>₹{m.price}</td>
                    <td>
                      <button className="release-btn" style={{marginRight: '10px'}} onClick={() => handleEditDish(m)}>Edit</button>
                      <button className="release-btn" style={{borderColor: '#ff6b6b', color: '#ff6b6b'}} onClick={() => handleDeleteDish(m.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'reservations' && (
          <div className="admin-reservations-card">
            <h3>Active Bookings</h3>
            {loadingRes ? <p>Loading...</p> : (
              <table className="res-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Guests</th>
                    <th>Time</th>
                    <th>Table(s)</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map(r => (
                    <tr key={r.id}>
                      <td>{r.id}</td>
                      <td>{r.customer_name}</td>
                      <td>{r.guests}</td>
                      <td>{r.time}</td>
                      <td>{r.specific_table}</td>
                      <td>
                        <span className={`status-badge ${r.status}`}>{r.status}</span>
                      </td>
                      <td>
                        {r.status !== 'released' && (
                          <button className="release-btn" onClick={() => handleReleaseTable(r.id)}>Release Table</button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {reservations.length === 0 && (
                    <tr>
                      <td colSpan="7">No reservations found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

            <h3 style={{marginTop: '40px'}}>Live Floor Map Status</h3>
            <div className="table-highlight-box floor-plan-box" style={{margin: '0 auto'}}>
              <div className="floor-plan-wrapper">
                <div className="fp-top-wall">
                  <div className="fp-room">Kitchen</div>
                  <div className="fp-room">Washroom & Hand wash</div>
                  <div className="fp-room">Reception</div>
                  <div className="fp-entry">&larr; Entry</div>
                </div>
                <div className="fp-upper-zone">
                  <div className="fp-room-half">
                    <div className="fp-column">
                      <div className="fp-col-label">4 Person</div>
                      <div className="fp-tables-grid">
                        {[...Array(8)].map((_,i) => renderAdminTable('t4', i, `4pL-${i+1}`, 'v'))}
                      </div>
                    </div>
                    <div className="fp-column">
                      <div className="fp-col-label">2 Person</div>
                      <div className="fp-tables-grid">
                        {[...Array(8)].map((_,i) => renderAdminTable('t2', i, `2pL-${i+1}`, 'v'))}
                      </div>
                    </div>
                  </div>
                  <div className="fp-center-divider">
                      <span className="fp-flower-vertical">Decoration<br/>Flower</span>
                  </div>
                  <div className="fp-room-half">
                    <div className="fp-column">
                      <div className="fp-col-label">4 Person</div>
                      <div className="fp-tables-grid">
                        {[...Array(8)].map((_,i) => renderAdminTable('t4', i, `4pR-${i+1}`, 'v'))}
                      </div>
                    </div>
                    <div className="fp-column">
                      <div className="fp-col-label">6 Person</div>
                      <div className="fp-tables-grid">
                        {[...Array(8)].map((_,i) => renderAdminTable('t6', i, `6pR-${i+1}`, 'v'))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="fp-bottom-zone">
                   <div className="fp-row">
                     <span className="fp-row-label">8 Person Floor Section</span>
                     <div className="fp-tables-horizontal">
                        {[...Array(5)].map((_,i) => renderAdminTable('t8', i, `8pB-${i+1}`, 'h'))}
                     </div>
                   </div>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </section>
  );
}
