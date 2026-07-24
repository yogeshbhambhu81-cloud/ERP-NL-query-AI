import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  IoNotificationsOutline, IoSearchOutline, IoPersonCircleOutline,
  IoClose, IoLogOutOutline, IoSettingsOutline, IoPersonOutline,
  IoCheckmarkCircle, IoWarning, IoInformationCircle, IoTimeOutline,
  IoMenuOutline,
} from 'react-icons/io5';
import { erpService } from '../../services/apiClient';
import { useDebounce } from '../../hooks/useDebounce';

const PAGE_TITLES = {
  '/':             { title: 'Dashboard',      subtitle: 'Your business at a glance' },
  '/query':        { title: 'AI Query',       subtitle: 'Ask questions in plain English' },
  '/search':       { title: 'Product Search', subtitle: 'Intelligent multi-filter search' },
  '/image-search': { title: 'Image Search',   subtitle: 'Find visually similar garments' },
  '/explorer':     { title: 'Goods Explorer', subtitle: 'Browse your finished goods inventory' },
};

const QUICK_NAV = [
  { label: 'Dashboard', path: '/' },
  { label: 'AI Query', path: '/query' },
  { label: 'Product Search', path: '/search' },
  { label: 'Image Search', path: '/image-search' },
  { label: 'Explorer', path: '/explorer' },
];

const STATIC_NOTIFICATIONS = [
  { id: 'n1', type: 'success', title: 'Order dispatched', message: '4,800 units of WFX-2026-SH03 shipped to Stockholm warehouse.', time: '2 hours ago', read: false },
  { id: 'n2', type: 'warning', title: 'Supplier lead time warning', message: 'Guangdong Silk Co. lead times delayed by 4 days due to port delays.', time: '5 hours ago', read: false },
  { id: 'n3', type: 'info', title: 'Sales invoice generated', message: 'INV-2026-011 issued for H&M Group (SO-002342) worth $78,500.', time: '1 day ago', read: false },
  { id: 'n4', type: 'success', title: 'New tech pack finalized', message: 'Style WFX-2026-JK01 spec measurements verified by QA.', time: '2 days ago', read: true },
  { id: 'n5', type: 'warning', title: 'Low stock alert', message: 'French Terry Hoodie (WFX-2026-HD02) is below minimum stock threshold.', time: '3 days ago', read: true },
];

function Navbar({ onMobileMenuToggle }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const meta = PAGE_TITLES[pathname] || { title: 'WFX ERP', subtitle: '' };

  // ─── Global Search State ──────
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const debouncedSearch = useDebounce(searchText, 300);
  const searchInputRef = useRef(null);
  const searchOverlayRef = useRef(null);

  // ─── Notifications State ──────
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(STATIC_NOTIFICATIONS);
  const notifRef = useRef(null);

  // ─── Account Dropdown State ──────
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // ─── Keyboard shortcut ⌘K / Ctrl+K ──────
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setNotifOpen(false);
        setAccountOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auto-focus search input when opened
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else {
      setSearchText('');
      setSearchResults([]);
    }
  }, [searchOpen]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (accountRef.current && !accountRef.current.contains(e.target)) setAccountOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // ─── Global Search Logic ──────
  useEffect(() => {
    if (!debouncedSearch || debouncedSearch.length < 2) {
      setSearchResults([]);
      return;
    }

    let cancelled = false;
    const doSearch = async () => {
      setSearchLoading(true);
      try {
        const products = await erpService.searchProducts({ q: debouncedSearch });
        if (!cancelled) {
          // Also add page navigation matches
          const pageMatches = QUICK_NAV.filter(p =>
            p.label.toLowerCase().includes(debouncedSearch.toLowerCase())
          ).map(p => ({ type: 'page', ...p }));

          const productMatches = products.slice(0, 6).map(p => ({
            type: 'product',
            label: p.styleName || p.style_name,
            subtitle: `${p.styleNumber || p.style_number} · ${p.fabric}`,
            path: '/search',
          }));

          setSearchResults([...pageMatches, ...productMatches]);
        }
      } catch {
        if (!cancelled) setSearchResults([]);
      } finally {
        if (!cancelled) setSearchLoading(false);
      }
    };
    doSearch();
    return () => { cancelled = true; };
  }, [debouncedSearch]);

  const handleSearchSelect = (item) => {
    setSearchOpen(false);
    navigate(item.path);
  };

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const markOneRead = useCallback((id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const notifIcon = (type) => {
    if (type === 'success') return <IoCheckmarkCircle style={{ color: 'var(--color-success)' }} />;
    if (type === 'warning') return <IoWarning style={{ color: 'var(--color-warning)' }} />;
    return <IoInformationCircle style={{ color: 'var(--color-info)' }} />;
  };

  return (
    <>
      <header className="wfx-navbar" role="banner">
        {/* Mobile hamburger */}
        <button className="navbar-mobile-menu" aria-label="Toggle navigation" onClick={onMobileMenuToggle}>
          <IoMenuOutline />
        </button>

        <div className="navbar-left">
          <h1 className="navbar-title">{meta.title}</h1>
          {meta.subtitle && <p className="navbar-subtitle">{meta.subtitle}</p>}
        </div>

        <div className="navbar-right">
          {/* Global Search Trigger */}
          <div className="navbar-search-hint" onClick={() => setSearchOpen(true)} role="button" tabIndex={0} aria-label="Open global search">
            <IoSearchOutline />
            <span>Search anything…</span>
            <kbd>⌘K</kbd>
          </div>

          {/* Notifications */}
          <div className="navbar-dropdown-wrapper" ref={notifRef}>
            <button
              className="navbar-icon-btn"
              aria-label="Notifications"
              onClick={() => { setNotifOpen(o => !o); setAccountOpen(false); }}
            >
              <IoNotificationsOutline />
              {unreadCount > 0 && <span className="navbar-notif-dot" aria-hidden="true">{unreadCount}</span>}
            </button>

            {notifOpen && (
              <div className="navbar-dropdown notif-dropdown" role="dialog" aria-label="Notifications panel">
                <div className="dropdown-header">
                  <h3>Notifications</h3>
                  {unreadCount > 0 && (
                    <button className="wfx-btn wfx-btn-ghost" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }} onClick={markAllRead}>
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="notif-list">
                  {notifications.length === 0 ? (
                    <p className="notif-empty">No notifications yet.</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`notif-item ${!n.read ? 'unread' : ''}`}
                        onClick={() => markOneRead(n.id)}
                        role="button"
                        tabIndex={0}
                      >
                        <span className="notif-item-icon">{notifIcon(n.type)}</span>
                        <div className="notif-item-content">
                          <p className="notif-item-title">{n.title}</p>
                          <p className="notif-item-msg">{n.message}</p>
                          <span className="notif-item-time"><IoTimeOutline size={12} /> {n.time}</span>
                        </div>
                        {!n.read && <span className="notif-unread-indicator" aria-label="Unread" />}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Account */}
          <div className="navbar-dropdown-wrapper" ref={accountRef}>
            <button
              className="navbar-avatar"
              aria-label="User account"
              onClick={() => { setAccountOpen(o => !o); setNotifOpen(false); }}
            >
              <IoPersonCircleOutline />
              <span className="navbar-avatar-label">Sunny Singh</span>
            </button>

            {accountOpen && (
              <div className="navbar-dropdown account-dropdown" role="dialog" aria-label="Account menu">
                <div className="account-header">
                  <div className="account-avatar-lg">
                    <IoPersonCircleOutline size={42} />
                  </div>
                  <div>
                    <p className="account-name">Sunny Singh</p>
                    <p className="account-email">sunny1524.be23@chitkarauniversity.edu.in</p>
                  </div>
                </div>
                <div className="account-divider" />
                <button className="account-menu-item" onClick={() => { setAccountOpen(false); }}>
                  <IoPersonOutline /> My Profile
                </button>
                <button className="account-menu-item" onClick={() => { setAccountOpen(false); }}>
                  <IoSettingsOutline /> Settings
                </button>
                <div className="account-divider" />
                <button className="account-menu-item account-menu-danger">
                  <IoLogOutOutline /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ─── Global Search Overlay ─── */}
      {searchOpen && (
        <div className="global-search-overlay" onClick={(e) => { if (e.target === e.currentTarget) setSearchOpen(false); }}>
          <div className="global-search-modal" ref={searchOverlayRef}>
            <div className="global-search-input-wrapper">
              <IoSearchOutline className="global-search-icon" />
              <input
                ref={searchInputRef}
                type="search"
                className="global-search-input"
                placeholder="Search products, pages, styles…"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                autoComplete="off"
              />
              <button className="global-search-close" onClick={() => setSearchOpen(false)} aria-label="Close search">
                <kbd>ESC</kbd>
              </button>
            </div>

            <div className="global-search-results">
              {searchLoading ? (
                <div className="global-search-loading">
                  <span className="wfx-skeleton" style={{ width: '60%', height: '1rem' }} />
                  <span className="wfx-skeleton" style={{ width: '45%', height: '1rem', marginTop: '0.5rem' }} />
                </div>
              ) : searchResults.length > 0 ? (
                searchResults.map((item, i) => (
                  <button
                    key={i}
                    className="global-search-result-item"
                    onClick={() => handleSearchSelect(item)}
                  >
                    <span className="search-result-type">{item.type === 'page' ? '📄' : '👕'}</span>
                    <div className="search-result-text">
                      <span className="search-result-label">{item.label}</span>
                      {item.subtitle && <span className="search-result-subtitle">{item.subtitle}</span>}
                    </div>
                    <span className="search-result-badge">{item.type === 'page' ? 'Page' : 'Product'}</span>
                  </button>
                ))
              ) : searchText.length >= 2 ? (
                <p className="global-search-empty">No results found for "{searchText}"</p>
              ) : (
                <div className="global-search-hints">
                  <p className="search-hints-label">Quick navigation</p>
                  {QUICK_NAV.map((p) => (
                    <button key={p.path} className="global-search-result-item" onClick={() => handleSearchSelect(p)}>
                      <span className="search-result-type">📄</span>
                      <div className="search-result-text">
                        <span className="search-result-label">{p.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
