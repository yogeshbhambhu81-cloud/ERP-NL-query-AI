import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  IoGridOutline,
  IoChatbubblesOutline,
  IoSearchOutline,
  IoImageOutline,
  IoLayersOutline,
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoSunnyOutline,
  IoMoonOutline,
  IoCloseOutline,
} from 'react-icons/io5';
import { useTheme } from '../../context/ThemeContext';

const NAV_ITEMS = [
  { to: '/',             icon: <IoGridOutline />,         label: 'Dashboard' },
  { to: '/query',        icon: <IoChatbubblesOutline />,  label: 'NL Query' },
  { to: '/search',       icon: <IoSearchOutline />,       label: 'Product Search' },
  { to: '/image-search', icon: <IoImageOutline />,        label: 'Image Search' },
  { to: '/explorer',     icon: <IoLayersOutline />,       label: 'Explorer' },
];

function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }) {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  return (
    <aside
      className={`wfx-sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <span>W</span>
        </div>
        {!collapsed && (
          <span className="sidebar-logo-text">
            WFX <span style={{ color: 'var(--primary)' }}>ERP</span>
          </span>
        )}
        {/* Mobile close button */}
        <button
          className="sidebar-mobile-close"
          onClick={onMobileClose}
          aria-label="Close navigation"
        >
          <IoCloseOutline />
        </button>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav" aria-label="Site navigation">
        {NAV_ITEMS.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `sidebar-nav-item ${isActive ? 'active' : ''}`
            }
            title={collapsed ? label : undefined}
            onClick={onMobileClose}
          >
            <span className="sidebar-nav-icon">{icon}</span>
            {!collapsed && <span className="sidebar-nav-label">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer Controls */}
      <div className="sidebar-footer">
        <button
          className="sidebar-footer-btn"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label="Toggle theme"
        >
          <span className="sidebar-nav-icon">
            {theme === 'dark' ? <IoSunnyOutline /> : <IoMoonOutline />}
          </span>
          {!collapsed && <span className="sidebar-nav-label">
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </span>}
        </button>

        <button
          className="sidebar-footer-btn sidebar-collapse-btn"
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          <span className="sidebar-nav-icon">
            {collapsed ? <IoChevronForwardOutline /> : <IoChevronBackOutline />}
          </span>
          {!collapsed && <span className="sidebar-nav-label">Collapse</span>}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
