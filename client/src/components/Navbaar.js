import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useHistory } from 'react-router-dom';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const history = useHistory();

  useEffect(() => {
    const loggedInStatus = localStorage.getItem('loggedIn');
    if (loggedInStatus === 'true') {
      setIsLoggedIn(true);
      setEmail(localStorage.getItem('email') || '');
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setEmail('');
    setShowDropdown(false);
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('email');
    history.push('/login');
  };

  return (
    <nav className="pro-navbar">
      <NavLink to="/home" className="nav-brand">CrudApp</NavLink>

      <ul className="nav-links">
        <li>
          <NavLink to="/home" className="nav-link-item" activeClassName="active-link" exact>
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/graph" className="nav-link-item" activeClassName="active-link">
            Analytics
          </NavLink>
        </li>
      </ul>

      <div className="nav-right">
        {isLoggedIn && (
          <div style={{ position: 'relative' }} ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(prev => !prev)}
              style={{
                width: 40, height: 40, borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                color: '#fff', border: '2px solid rgba(255,255,255,0.3)',
                fontSize: 16, fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                textTransform: 'uppercase', transition: 'all 0.2s',
              }}
            >
              {email ? email[0] : '?'}
            </button>
            {showDropdown && (
              <div style={{
                position: 'absolute', right: 0, top: 50,
                background: '#fff', borderRadius: 14,
                boxShadow: '0 12px 40px rgba(0,0,0,0.18)',
                minWidth: 230, overflow: 'hidden', zIndex: 200,
                border: '1px solid #eee',
              }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0' }}>
                  <div style={{ fontSize: 11, color: '#aaa', textTransform: 'uppercase', letterSpacing: 0.5 }}>Signed in as</div>
                  <div style={{ fontSize: 14, color: '#333', fontWeight: 500, marginTop: 4, wordBreak: 'break-all' }}>{email}</div>
                </div>
                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%', padding: '13px 20px', border: 'none',
                    background: 'none', textAlign: 'left', fontSize: 14,
                    color: '#e74c3c', fontWeight: 600, cursor: 'pointer',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#fdf2f2'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
