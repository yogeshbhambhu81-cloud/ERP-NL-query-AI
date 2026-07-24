import React, { memo } from 'react';

const TREND_UP   = '↑';
const TREND_DOWN = '↓';

const DashboardCard = memo(function DashboardCard({ title, value, change, icon, accent = '#6366f1' }) {
  const isPositive = !change || change.startsWith('+');

  return (
    <div className="wfx-card dashboard-stat-card" role="region" aria-label={title}>
      <div className="stat-card-header">
        <span className="stat-card-label">{title}</span>
        <span className="stat-card-icon" style={{ background: `${accent}18`, color: accent }}>
          {icon}
        </span>
      </div>
      <div className="stat-card-value">{value}</div>
      {change && (
        <div className={`stat-card-change ${isPositive ? 'positive' : 'negative'}`}>
          <span>{isPositive ? TREND_UP : TREND_DOWN}</span>
          <span>{change}</span>
        </div>
      )}
    </div>
  );
});

export default DashboardCard;
