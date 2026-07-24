import React, { useEffect, useCallback } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import {
  IoLayersOutline, IoPeopleOutline, IoPersonOutline,
  IoCartOutline, IoCashOutline, IoTimeOutline,
} from 'react-icons/io5';
import DashboardCard from '../components/features/DashboardCard';
import { SkeletonCard } from '../components/ui/Skeleton';
import { erpService } from '../services/apiClient';
import { useFetch } from '../hooks/useFetch';
import { formatCurrency, formatNumber } from '../utils/formatters';
import Badge from '../components/ui/Badge';
import ExportButton from '../components/ui/ExportButton';
import { exportToCSV } from '../utils/csvExport';

const fetchDashboard = (signal) => erpService.getDashboardData(signal);

function Dashboard() {
  const { data, loading, error, execute } = useFetch(fetchDashboard, false);

  useEffect(() => { execute(); }, [execute]);

  const d = data || {};

  const statusBadgeMap = {
    success: 'success',
    info: 'info',
    warning: 'warning',
    pending: 'warning',
  };

  if (error) {
    return (
      <div className="wfx-card" style={{ borderLeft: '4px solid var(--danger)', padding: '1.5rem', marginTop: '1rem' }}>
        <h2 style={{ color: 'var(--danger)', marginTop: 0 }}>Error Loading Dashboard</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{error}</p>
        <button className="wfx-btn wfx-btn-primary" onClick={execute}>Retry Request</button>
      </div>
    );
  }

  if (loading) {
    return (
      <div>
        <div className="kpi-grid" style={{ marginBottom: '1.5rem' }}>
          {Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
        <div className="dashboard-charts-grid">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="wfx-card" style={{ height: 320 }}>
              <div className="wfx-skeleton" style={{ width: '40%', height: '1rem', marginBottom: '1.5rem' }} />
              <div className="wfx-skeleton" style={{ width: '100%', height: '240px' }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const kpis = d.kpis || {};
  const changes = kpis.changes || {};

  return (
    <div>
      {/* KPI Cards */}
      <section aria-label="Key performance indicators">
        <div className="kpi-grid">
          <DashboardCard
            title="Finished Goods"
            value={formatNumber(kpis.totalFinishedGoods)}
            change={changes.finishedGoods}
            icon={<IoLayersOutline />}
            accent="#6366f1"
          />
          <DashboardCard
            title="Total Suppliers"
            value={formatNumber(kpis.totalSuppliers)}
            change={changes.suppliers}
            icon={<IoPeopleOutline />}
            accent="#3b82f6"
          />
          <DashboardCard
            title="Total Buyers"
            value={formatNumber(kpis.totalBuyers)}
            change={changes.buyers}
            icon={<IoPersonOutline />}
            accent="#10b981"
          />
          <DashboardCard
            title="Total Orders"
            value={formatNumber(kpis.totalOrders)}
            change={changes.orders}
            icon={<IoCartOutline />}
            accent="#f59e0b"
          />
          <DashboardCard
            title="Total Revenue"
            value={formatCurrency(kpis.totalRevenue)}
            change={changes.revenue}
            icon={<IoCashOutline />}
            accent="#ec4899"
          />
        </div>
      </section>

      {/* Charts Row */}
      <section aria-label="Analytics charts" style={{ marginTop: '1.75rem' }}>
        <div className="dashboard-charts-grid">
          {/* Revenue Area Chart */}
          <div className="wfx-card">
            <h2 className="chart-title">Revenue & Profit Trend</h2>
            <p className="chart-subtitle">Full fiscal year performance</p>
            <div style={{ marginTop: '1.25rem' }}>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={d.revenueTrend || []} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 8, fontSize: 13 }}
                    labelStyle={{ color: 'var(--text-primary)', fontWeight: 600 }}
                    formatter={(v) => formatCurrency(v)}
                  />
                  <Legend wrapperStyle={{ fontSize: 12, color: 'var(--text-secondary)' }} />
                  <Area type="monotone" dataKey="Revenue" stroke="#6366f1" fill="url(#gradRevenue)" strokeWidth={2} dot={false} />
                  <Area type="monotone" dataKey="Profit"  stroke="#10b981" fill="url(#gradProfit)"  strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Orders Bar Chart */}
          <div className="wfx-card">
            <h2 className="chart-title">Monthly Orders</h2>
            <p className="chart-subtitle">Units dispatched per month</p>
            <div style={{ marginTop: '1.25rem' }}>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={d.revenueTrend || []} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 8, fontSize: 13 }}
                    labelStyle={{ color: 'var(--text-primary)', fontWeight: 600 }}
                  />
                  <Bar dataKey="Orders" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Row */}
      <section style={{ marginTop: '1.75rem' }}>
        <div className="dashboard-bottom-grid">
          {/* Category Pie */}
          <div className="wfx-card">
            <h2 className="chart-title">Product Categories</h2>
            <p className="chart-subtitle">Stock distribution by category</p>
            <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
              <ResponsiveContainer width={180} height={180}>
                <PieChart>
                  <Pie data={d.productCategories || []} cx="50%" cy="50%" innerRadius={55} outerRadius={82} paddingAngle={3} dataKey="value">
                    {(d.productCategories || []).map((entry, index) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 8, fontSize: 13 }}
                    formatter={(v) => formatNumber(v)}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {(d.productCategories || []).map((cat) => (
                  <div key={cat.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                    <span style={{ width: 10, height: 10, borderRadius: 3, background: cat.color, flexShrink: 0 }} />
                    <span style={{ color: 'var(--text-secondary)' }}>{cat.name}</span>
                    <span style={{ marginLeft: 'auto', fontWeight: 600, paddingLeft: '1rem' }}>{formatNumber(cat.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Supplier Performance */}
          <div className="wfx-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h2 className="chart-title">Supplier Scorecard</h2>
                <p className="chart-subtitle">Performance ranking this quarter</p>
              </div>
              <ExportButton
                onExport={() => exportToCSV(
                  d.supplierPerformance || [],
                  'suppliers',
                  ['name', 'score', 'onTime', 'leadTime'],
                  { name: 'Supplier', score: 'Score (%)', onTime: 'On-Time (%)', leadTime: 'Lead Time' }
                )}
                disabled={!d.supplierPerformance || d.supplierPerformance.length === 0}
              />
            </div>
            <div className="wfx-table-container" style={{ marginTop: '1rem', border: 'none', borderRadius: 0 }}>
              <table className="wfx-table" aria-label="Supplier performance table">
                <thead>
                  <tr>
                    <th>Supplier</th>
                    <th>Score</th>
                    <th>On-Time</th>
                    <th>Lead Time</th>
                  </tr>
                </thead>
                <tbody>
                  {(d.supplierPerformance || []).map((s) => (
                    <tr key={s.id}>
                      <td style={{ fontWeight: 500 }}>{s.name}</td>
                      <td>
                        <Badge variant={s.score >= 90 ? 'success' : s.score >= 80 ? 'warning' : 'danger'}>
                          {s.score}%
                        </Badge>
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>{s.onTime}%</td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{s.leadTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="wfx-card">
            <h2 className="chart-title">Recent Activity</h2>
            <p className="chart-subtitle">Latest events across your ERP</p>
            <div className="activity-feed" style={{ marginTop: '1rem' }}>
              {(d.recentActivity || []).map((item) => (
                <div key={item.id} className="activity-item">
                  <div className={`activity-dot activity-dot-${item.status}`} aria-hidden="true" />
                  <div className="activity-content">
                    <p className="activity-title">{item.title}</p>
                    <p className="activity-detail">{item.detail}</p>
                  </div>
                  <div className="activity-time">
                    <IoTimeOutline />
                    <span>{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
