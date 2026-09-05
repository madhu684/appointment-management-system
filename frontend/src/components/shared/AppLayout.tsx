import { NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Dashboard', icon: 'bi-grid' },
  { to: '/appointments', label: 'Appointments', icon: 'bi-calendar3' },
  { to: '/practitioners', label: 'Practitioners', icon: 'bi-person-badge' },
  { to: '/sessions', label: 'Sessions', icon: 'bi-calendar-week' },
];

export const AppLayout = () => (
  <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fa' }}>
    {/* Sidebar */}
    <nav style={{
      width: 220, background: '#fff', borderRight: '1px solid #e9ecef',
      display: 'flex', flexDirection: 'column', flexShrink: 0,
    }}>
      {/* Brand */}
      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid #e9ecef' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8, background: '#E1F5EE',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <i className="bi bi-calendar-heart" style={{ color: '#085041', fontSize: 16 }} />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, lineHeight: 1.2 }}>AMS</div>
            <div style={{ fontSize: 11, color: '#6c757d' }}>Appointment System</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div style={{ flex: 1, padding: '12px 10px' }}>
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 12px', borderRadius: 8, marginBottom: 2,
              textDecoration: 'none', fontSize: 14, fontWeight: 500,
              color: isActive ? '#085041' : '#495057',
              background: isActive ? '#E1F5EE' : 'transparent',
              transition: 'all .15s',
            })}
          >
            <i className={`bi ${item.icon}`} style={{ fontSize: 16 }} />
            {item.label}
          </NavLink>
        ))}
      </div>

      {/* Footer */}
      <div style={{ padding: '12px 20px', borderTop: '1px solid #e9ecef' }}>
        <p style={{ fontSize: 11, color: '#adb5bd', margin: 0 }}>
          Built with Clean Architecture
        </p>
        <p style={{ fontSize: 11, color: '#adb5bd', margin: 0 }}>
          ASP.NET Core 8 · React · TanStack Query
        </p>
      </div>
    </nav>

    {/* Main content */}
    <main style={{ flex: 1, padding: '28px 32px', overflowY: 'auto' }}>
      <Outlet />
    </main>
  </div>
);
