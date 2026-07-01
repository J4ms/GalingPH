import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import { useTheme } from '../ThemeContext';

export default function Admin() {
  const navigate = useNavigate();
  const { user, isAdmin, allUsers, deleteUser, toggleUserStatus, logout } = useUser();
  const { theme, toggle } = useTheme();
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Redirect non-admins
  if (!user || !isAdmin) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-page)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontSize: 48 }}>🔒</div>
        <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>Access Denied</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Only admin accounts can access this page.</p>
        <p style={{ color: 'var(--text-muted)', fontSize: 12, fontFamily: 'var(--font-mono)' }}>Login with: admin@galingph.com / admin123</p>
        <button className="cta-primary" style={{ height: 44, padding: '0 24px', fontSize: 14 }} onClick={() => navigate('/auth')}>Go to Login</button>
      </div>
    );
  }

  const filteredUsers = allUsers.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: allUsers.length,
    active: allUsers.filter(u => u.status === 'active').length,
    suspended: allUsers.filter(u => u.status === 'suspended').length,
    admins: allUsers.filter(u => u.role === 'admin').length,
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)' }}>
      {/* Top bar */}
      <div style={{ height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800 }} className="grad-text">GalingPH</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#E85D24', background: 'rgba(232,93,36,0.1)', padding: '4px 10px', borderRadius: 20, fontWeight: 600 }}>ADMIN</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="cta-secondary" style={{ height: 36, padding: '0 16px', fontSize: 13 }} onClick={() => navigate('/app')}>← Dashboard</button>
          <button className="theme-toggle" onClick={toggle} style={{ width: 36, height: 36 }}>
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <button className="cta-secondary" style={{ height: 36, padding: '0 16px', fontSize: 13, color: '#E85D24', borderColor: '#E85D24' }} onClick={() => { logout(); navigate('/'); }}>Sign Out</button>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'Total Users', value: stats.total, color: 'var(--accent)' },
            { label: 'Active', value: stats.active, color: '#00C98A' },
            { label: 'Suspended', value: stats.suspended, color: '#E85D24' },
            { label: 'Admins', value: stats.admins, color: '#3B00FF' },
          ].map(s => (
            <div key={s.label} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '20px 16px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>Manage Users</h2>
          <input type="text" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-surface)', color: 'var(--text-primary)', fontSize: 13, width: 240 }} />
        </div>

        {/* Users Table */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(u => (
                <tr key={u.email}>
                  <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{u.name || `${u.firstName || ''} ${u.lastName || ''}`}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{u.email}</td>
                  <td><span className={`badge ${u.role === 'admin' ? 'badge-blue' : 'badge-muted'}`}>{u.role || 'user'}</span></td>
                  <td><span className={`badge ${u.status === 'active' ? 'badge-green' : 'badge-muted'}`} style={u.status === 'suspended' ? { background: 'rgba(232,93,36,0.1)', color: '#E85D24' } : {}}>{u.status || 'active'}</span></td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{u.createdAt || 'N/A'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {u.role !== 'admin' && (
                        <>
                          <button onClick={() => toggleUserStatus(u.email)} style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid var(--border)', background: 'transparent', fontSize: 11, cursor: 'pointer', color: 'var(--text-secondary)' }}>
                            {u.status === 'active' ? 'Suspend' : 'Activate'}
                          </button>
                          {confirmDelete === u.email ? (
                            <button onClick={() => { deleteUser(u.email); setConfirmDelete(null); }} style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #E85D24', background: 'rgba(232,93,36,0.1)', fontSize: 11, cursor: 'pointer', color: '#E85D24', fontWeight: 600 }}>
                              Confirm
                            </button>
                          ) : (
                            <button onClick={() => setConfirmDelete(u.email)} style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid var(--border)', background: 'transparent', fontSize: 11, cursor: 'pointer', color: '#E85D24' }}>
                              Delete
                            </button>
                          )}
                        </>
                      )}
                      {u.role === 'admin' && <span style={{ fontSize: 11, color: 'var(--text-muted)', padding: '4px 0' }}>Protected</span>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
