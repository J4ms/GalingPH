import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../ThemeContext';
import { useUser } from '../UserContext';

const SunIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);

const MoonIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

const BellIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const GridIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
);

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const StarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const TargetIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
  </svg>
);

const BookIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
);

const BriefcaseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
  </svg>
);

const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>
  </svg>
);

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const MoreIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
  </svg>
);

const FolderIcon = ({ color = 'var(--accent)' }) => (
  <svg viewBox="0 0 24 24" fill={color} stroke="none">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
  </svg>
);

const FileIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
  </svg>
);

const ChevronRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

const features = [
  { num: '01', name: 'AI Career Recommendations', desc: 'Claude AI maps your resume and certifications to real career pathways registered under DOLE.', tags: ['Claude AI', 'Personalized'], wide: true },
  { num: '02', name: 'Skills Gap Analysis', desc: 'Know exactly which skills you\'re missing and get a step-by-step plan to close the gap.', tags: ['Gap Analysis', 'Actionable'], wide: false },
  { num: '03', name: 'TESDA Training Suggestions', desc: 'Get matched to accredited TESDA courses that directly address your missing skills.', tags: ['TESDA', 'Free Courses'], wide: false },
  { num: '04', name: 'Career Readiness Score', desc: 'A live score that updates as you learn, upload documents, and complete trainings.', tags: ['Live Score', 'AI-Scored'], wide: true },
];

const careerRows = [
  { name: 'Software Engineer', type: 'folder', match: '94%', status: 'Strong Match', skills: 3, modified: 'Today', sharing: [{ i: 'JD', c: '#00C98A' }, { i: 'MS', c: '#3B00FF' }] },
  { name: 'Web Developer', type: 'folder', match: '81%', status: 'Good Match', skills: 5, modified: 'Yesterday', sharing: [{ i: 'JD', c: '#00C98A' }] },
  { name: 'Bookkeeper', type: 'folder', match: '73%', status: 'Partial Match', skills: 8, modified: 'Apr 10', sharing: [] },
  { name: 'Graphic Designer', type: 'file', match: '68%', status: 'Partial Match', skills: 6, modified: 'Apr 2', sharing: [{ i: 'AM', c: '#E85D24' }, { i: 'JD', c: '#00C98A' }, { i: 'MS', c: '#3B00FF' }] },
  { name: 'Healthcare Worker', type: 'file', match: '55%', status: 'Low Match', skills: 12, modified: 'Mar 28', sharing: [] },
  { name: 'Electrician', type: 'file', match: '61%', status: 'Partial Match', skills: 9, modified: 'Mar 15', sharing: [{ i: 'JD', c: '#00C98A' }] },
  { name: 'TESDA Trainer', type: 'file', match: '79%', status: 'Good Match', skills: 4, modified: 'Feb 22', sharing: [] },
];

function FeatureIcon({ num }) {
  if (num === '01') return <TargetIcon />;
  if (num === '02') return <SearchIcon />;
  if (num === '03') return <BookIcon />;
  return <StarIcon />;
}

export default function Landing() {
  const navigate = useNavigate();
  const { theme, toggle } = useTheme();
  const { user } = useUser();
  const [activeRow, setActiveRow] = useState(0);
  const [activeTab, setActiveTab] = useState('Activity');
  const featureRefs = useRef([]);
  const [sidebarActive, setSidebarActive] = useState('Career Paths');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const observers = [];
    featureRefs.current.forEach((el, i) => {
      if (!el) return;
      const obs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => el.classList.add('visible'), i * 100);
        }
      }, { threshold: 0.15 });
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  const selectedRow = careerRows[activeRow];

  const scrollToHowItWorks = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const sidebarItems = [
    { label: 'Dashboard', icon: <HomeIcon /> },
    { label: 'Career Paths', icon: <TargetIcon /> },
    { label: 'Skills Gap', icon: <StarIcon /> },
    { label: 'Training', icon: <BookIcon /> },
    { label: 'Jobs (PESO)', icon: <BriefcaseIcon /> },
  ];

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh' }}>

      {/* ── HERO SECTION (dashboard shell) ── */}
      <section style={{ background: 'var(--bg-page)', padding: '0 0 80px' }}>

        {/* Top landing bar */}
        <div className="landing-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <div className="sidebar-logo" style={{ borderBottom: 'none', padding: 0, margin: 0 }}>
              <span className="grad-text">GalingPH</span>
            </div>
            <nav className="landing-nav">
              {['Platform', 'About', 'TESDA', 'Contact'].map(l => (
                <button key={l} className="landing-nav-link">{l}</button>
              ))}
            </nav>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button className="theme-toggle" onClick={toggle} title="Toggle theme">
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>
            {user ? (
              <>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}>
                  Hi, <strong style={{ color: 'var(--text-primary)' }}>{user.name?.split(' ')[0]}</strong>
                </div>
                <button className="cta-primary" style={{ height: 36, padding: '0 18px', fontSize: 13 }} onClick={() => navigate('/app')}>
                  Dashboard
                </button>
              </>
            ) : (
              <>
                <button className="cta-secondary" style={{ height: 36, padding: '0 18px', fontSize: 13 }} onClick={() => navigate('/auth')}>
                  Sign In
                </button>
                <button className="cta-primary" style={{ height: 36, padding: '0 18px', fontSize: 13 }} onClick={() => navigate('/auth')}>
                  Get Started Free
                </button>
              </>
            )}
            <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(true)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
          </div>
        </div>

        {/* Mobile nav drawer */}
        {mobileMenuOpen && (
          <div className="mobile-nav-overlay" style={{ display: 'block' }} onClick={() => setMobileMenuOpen(false)}>
            <div className="mobile-nav-drawer" onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <span className="grad-text" style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800 }}>GalingPH</span>
                <button onClick={() => setMobileMenuOpen(false)} style={{ background: 'transparent', border: 'none', fontSize: 20, color: 'var(--text-muted)', cursor: 'pointer' }}>✕</button>
              </div>
              {['Platform', 'About', 'TESDA', 'Contact'].map(l => (
                <button key={l} className="mobile-nav-drawer-link" onClick={() => setMobileMenuOpen(false)}>{l}</button>
              ))}
              <Link to="/mobile" className="mobile-nav-drawer-link" onClick={() => setMobileMenuOpen(false)}>Mobile Demo</Link>
              <Link to="/team" className="mobile-nav-drawer-link" onClick={() => setMobileMenuOpen(false)}>Team</Link>
              <div style={{ marginTop: 'auto', paddingTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {user ? (
                  <>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8, padding: '0 16px' }}>
                      Signed in as <strong style={{ color: 'var(--text-primary)' }}>{user.name}</strong>
                    </div>
                    <button className="cta-primary" style={{ width: '100%', height: 44, fontSize: 14 }} onClick={() => { setMobileMenuOpen(false); navigate('/app'); }}>Go to Dashboard</button>
                  </>
                ) : (
                  <>
                    <button className="cta-primary" style={{ width: '100%', height: 44, fontSize: 14 }} onClick={() => { setMobileMenuOpen(false); navigate('/auth'); }}>Get Started Free</button>
                    <button className="cta-secondary" style={{ width: '100%', height: 44, fontSize: 14 }} onClick={() => { setMobileMenuOpen(false); navigate('/auth'); }}>Sign In</button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Hero headline */}
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '64px 40px 32px', textAlign: 'center' }}>
          <div className="hero-pill" style={{ margin: '0 auto 24px' }}>AI-Powered Career Intelligence</div>
          <h1 className="hero-headline" style={{ textAlign: 'center', fontSize: 'clamp(36px, 5vw, 64px)', marginBottom: 20 }}>
            Discover Your Career Path,{' '}
            <span className="grad-text">Powered by AI.</span>
          </h1>
          <p className="hero-sub" style={{ maxWidth: 560, margin: '0 auto 32px', textAlign: 'center' }}>
            GalingPH matches your skills, certifications, and goals to real career pathways — aligned with TESDA, DOLE, and PESO frameworks.
          </p>
          <div className="cta-row" style={{ justifyContent: 'center', flexWrap: 'wrap', gap: 12 }}>
            <button className="cta-primary" onClick={() => navigate('/onboarding')}>Start Your Journey</button>
            <button className="cta-secondary" onClick={scrollToHowItWorks}>How It Works</button>
            <button className="cta-secondary" onClick={() => navigate('/mobile')}>View Mobile Demo</button>
          </div>
          <div className="trust-strip" style={{ justifyContent: 'center' }}>
            <span>TESDA-Aligned</span>
            <span className="trust-dot">·</span>
            <span>Free to Use</span>
            <span className="trust-dot">·</span>
            <span>Filipino-Built</span>
          </div>
        </div>

        {/* DASHBOARD MOCKUP — Minecloud-style 3-column */}
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: 20,
            overflow: 'hidden',
            boxShadow: '0 24px 64px rgba(0,0,0,0.08)',
          }}>

            {/* Inner app shell */}
            <div style={{ display: 'flex', height: 520 }}>

              {/* Sidebar */}
              <div className="sidebar" style={{ width: 200 }}>
                <div className="sidebar-logo" style={{ fontSize: 15 }}>
                  <span className="grad-text">GalingPH</span>
                </div>
                {sidebarItems.map(item => (
                  <button
                    key={item.label}
                    className={`sidebar-item${sidebarActive === item.label ? ' active' : ''}`}
                    onClick={() => setSidebarActive(item.label)}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
                <div className="sidebar-section-label">Settings</div>
                <button className="sidebar-item"><SettingsIcon /><span>Preferences</span></button>
                <button className="sidebar-item"><TrashIcon /><span>Deleted</span></button>
                <div className="sidebar-bottom">
                  <div className="storage-bar-wrap">
                    <div className="storage-label">
                      Storage
                      <span>42 GB / 256 GB</span>
                    </div>
                    <div className="storage-track">
                      <div className="storage-fill" style={{ width: '16%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Main area */}
              <div className="main-content">
                {/* Topbar */}
                <div className="topbar">
                  <div className="topbar-nav">
                    {['Career Paths', 'Activity', 'Training', 'Jobs'].map((t, i) => (
                      <button key={t} className={`topbar-nav-item${i === 0 ? ' active' : ''}`}>
                        {i === 0 && <TargetIcon />}
                        {t}
                      </button>
                    ))}
                  </div>
                  <div className="topbar-search">
                    <SearchIcon />
                    Search careers...
                  </div>
                  <div className="topbar-actions">
                    <button className="topbar-icon-btn"><BellIcon /></button>
                    <button className="theme-toggle" onClick={toggle} style={{ width: 32, height: 32 }}>
                      {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
                    </button>
                    <div className="avatar">JD</div>
                  </div>
                </div>

                {/* Content */}
                <div className="content-scroll">
                  {/* Quick access */}
                  <div>
                    <div className="section-header">
                      <span className="section-title">Quick Access</span>
                      <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><MoreIcon /></button>
                    </div>
                    <div className="quick-access-grid">
                      {[
                        { name: 'Software Engineer', meta: '94% match · 3 skills', color: '#00C98A' },
                        { name: 'Web Developer', meta: '81% match · 5 skills', color: '#3B00FF' },
                        { name: 'Bookkeeper', meta: '73% match · 8 skills', color: '#E85D24' },
                        { name: 'My Resume', meta: '2.3 MB · Updated today', color: '#7A8A9A' },
                      ].map(c => (
                        <div key={c.name} className="quick-card">
                          <div className="quick-card-icon">
                            <FolderIcon color={c.color} />
                          </div>
                          <div className="quick-card-name">{c.name}</div>
                          <div className="quick-card-meta">{c.meta}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Table */}
                  <div className="table-container">
                    <div className="table-toolbar">
                      <div className="breadcrumb">
                        <span>Home</span>
                        <ChevronRight />
                        <span className="breadcrumb-sep">Career Analysis</span>
                        <ChevronRight />
                        <span className="breadcrumb-current">All Matches</span>
                      </div>
                      <div className="table-actions">
                        <button className="btn-secondary"><GridIcon /> View</button>
                        <button className="btn-primary" onClick={() => navigate('/onboarding')}>
                          <PlusIcon /> Add New
                        </button>
                      </div>
                    </div>
                    <table>
                      <thead>
                        <tr>
                          <th>Career Name</th>
                          <th>Match Score</th>
                          <th>Status</th>
                          <th>Skills Gap</th>
                          <th>Updated</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {careerRows.map((row, i) => (
                          <tr
                            key={row.name}
                            className={activeRow === i ? 'active-row' : ''}
                            onClick={() => setActiveRow(i)}
                          >
                            <td>
                              <div className="td-name">
                                <div className="td-icon" style={{ background: row.type === 'folder' ? 'var(--accent-light)' : 'var(--bg-card)', border: '1px solid var(--border)' }}>
                                  {row.type === 'folder'
                                    ? <FolderIcon color="var(--accent)" />
                                    : <FileIcon />
                                  }
                                </div>
                                {row.name}
                              </div>
                            </td>
                            <td>
                              <div className="avatar-stack">
                                {row.sharing.slice(0, 3).map((s, si) => (
                                  <div key={si} className="avatar-sm" style={{ background: s.c }}>{s.i}</div>
                                ))}
                                {row.sharing.length > 3 && (
                                  <div className="avatar-sm avatar-count">+{row.sharing.length - 3}</div>
                                )}
                              </div>
                            </td>
                            <td>
                              <span className={`badge ${row.match >= '80%' ? 'badge-green' : row.match >= '65%' ? 'badge-blue' : 'badge-muted'}`}>
                                {row.match}
                              </span>
                            </td>
                            <td>{row.skills} skills</td>
                            <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{row.modified}</td>
                            <td><button className="row-menu-btn"><MoreIcon /></button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Right panel */}
              <div className="right-panel">
                <div className="right-panel-header">
                  <div>
                    <div className="right-panel-title">{selectedRow.name}</div>
                    <div className="detail-meta">{selectedRow.match} match · {selectedRow.skills} skills gap</div>
                  </div>
                  <button className="right-panel-close">✕</button>
                </div>

                <div className="detail-tabs">
                  {['Activity', 'Skills', 'Training'].map(t => (
                    <button key={t} className={`detail-tab${activeTab === t ? ' active' : ''}`} onClick={() => setActiveTab(t)}>{t}</button>
                  ))}
                </div>

                <div className="right-panel-body">
                  {/* Tags */}
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Tags</div>
                    <div className="detail-tags">
                      <span className="badge badge-green">TESDA</span>
                      <span className="badge badge-blue">DOLE</span>
                      <span className="badge badge-muted">Tech</span>
                    </div>
                  </div>

                  {/* Sharing */}
                  <div>
                    <div className="detail-sharing">
                      <span className="detail-sharing-label" style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Sharing</span>
                      <span className="detail-sharing-action">Manage</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10 }}>
                      {selectedRow.sharing.slice(0, 4).map((s, i) => (
                        <div key={i} className="avatar-sm" style={{ background: s.c, width: 28, height: 28, fontSize: 10 }}>{s.i}</div>
                      ))}
                      {selectedRow.sharing.length === 0 && (
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Only you</span>
                      )}
                    </div>
                  </div>

                  {/* Activity */}
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Recent Activity</div>
                    <div className="activity-list">
                      {[
                        { date: 'Today', text: 'AI analysis updated your match score', link: null, active: true },
                        { date: 'Yesterday', text: 'You uploaded a new TESDA certificate', link: 'NC II Cert', active: true },
                        { date: 'Apr 10', text: 'Skills gap reduced from 6 to 3 skills', link: null, active: false },
                        { date: 'Apr 2', text: 'Career path generated by', link: 'Claude AI', active: false },
                      ].map((a, i) => (
                        <div key={i} className="activity-item">
                          <div className={`activity-dot${a.active ? ' active' : ''}`} />
                          <div>
                            <div className="activity-date">{a.date}</div>
                            <div className="activity-text">
                              {a.text} {a.link && <span className="activity-link">{a.link}</span>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="features-section">
        <div className="section-center">
          <div className="eyebrow">What GalingPH Does</div>
          <h2 className="section-h">Everything you need to find your path.</h2>
        </div>
        <div className="features-grid" style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="features-row">
            <div className="feature-card" style={{ flex: '0 0 60%' }} ref={el => featureRefs.current[0] = el}>
              <div className="feature-num">{features[0].num}</div>
              <div className="feature-icon"><FeatureIcon num={features[0].num} /></div>
              <div className="feature-name">{features[0].name}</div>
              <div className="feature-desc">{features[0].desc}</div>
              <div className="feature-tags">{features[0].tags.map(t => <span key={t} className="feature-tag">{t}</span>)}</div>
            </div>
            <div className="feature-card" style={{ flex: '0 0 40%' }} ref={el => featureRefs.current[1] = el}>
              <div className="feature-num">{features[1].num}</div>
              <div className="feature-icon"><FeatureIcon num={features[1].num} /></div>
              <div className="feature-name">{features[1].name}</div>
              <div className="feature-desc">{features[1].desc}</div>
              <div className="feature-tags">{features[1].tags.map(t => <span key={t} className="feature-tag">{t}</span>)}</div>
            </div>
          </div>
          <div className="features-row">
            <div className="feature-card" style={{ flex: '0 0 40%' }} ref={el => featureRefs.current[2] = el}>
              <div className="feature-num">{features[2].num}</div>
              <div className="feature-icon"><FeatureIcon num={features[2].num} /></div>
              <div className="feature-name">{features[2].name}</div>
              <div className="feature-desc">{features[2].desc}</div>
              <div className="feature-tags">{features[2].tags.map(t => <span key={t} className="feature-tag">{t}</span>)}</div>
            </div>
            <div className="feature-card" style={{ flex: '0 0 60%' }} ref={el => featureRefs.current[3] = el}>
              <div className="feature-num">{features[3].num}</div>
              <div className="feature-icon"><FeatureIcon num={features[3].num} /></div>
              <div className="feature-name">{features[3].name}</div>
              <div className="feature-desc">{features[3].desc}</div>
              <div className="feature-tags">{features[3].tags.map(t => <span key={t} className="feature-tag">{t}</span>)}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" style={{ background: 'var(--bg-page)', padding: '100px 40px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="section-center">
            <div className="eyebrow">The Process</div>
            <h2 className="section-h">Three steps to your career path.</h2>
          </div>
          <div className="steps-row">
            <div className="step-divider" />
            {[
              { n: '01', title: 'Upload Your Documents', desc: 'Add your resume and TESDA certificates. Our OCR reads them automatically.' },
              { n: '02', title: 'Get Your AI Analysis', desc: 'Claude AI extracts your skills, scores your readiness, and identifies career matches.' },
              { n: '03', title: 'Follow Your Path', desc: 'Get a personalised career pathway with TESDA trainings and PESO job opportunities.' },
            ].map(s => (
              <div key={s.n} className="step">
                <div className="step-num grad-text">{s.n}</div>
                <div className="step-title">{s.title}</div>
                <div className="step-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PARTNERS ── */}
      <section className="partners-strip">
        <div className="partners-label">Aligned with Philippine Government Frameworks</div>
        <div className="partners-row">
          {['TESDA', 'DOLE', 'PESO', 'LGU'].map(p => (
            <div key={p} className="partner-name">{p}</div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="cta-banner">
        <div className="cta-banner-title">Ready to find your career path?</div>
        <div className="cta-banner-sub">Join thousands of Filipino youth using GalingPH to map their future.</div>
        <button className="cta-banner-btn" onClick={() => navigate('/onboarding')}>Get Started Free</button>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-cols">
            <div className="footer-col">
              <div className="footer-wordmark grad-text">GalingPH</div>
              <div className="footer-tagline">
                AI-powered career intelligence platform built for Filipino youth. Aligned with TESDA, DOLE, and PESO frameworks.
              </div>
              <div className="footer-social">
                <button className="footer-social-btn" aria-label="Facebook">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </button>
                <button className="footer-social-btn" aria-label="Twitter">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </button>
                <button className="footer-social-btn" aria-label="GitHub">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                </button>
                <button className="footer-social-btn" aria-label="LinkedIn">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </button>
              </div>
            </div>
            <div className="footer-col">
              <div className="footer-col-title">Platform</div>
              <div className="footer-link" onClick={() => navigate('/app')}>Dashboard</div>
              <div className="footer-link" onClick={() => navigate('/app')}>Career Paths</div>
              <div className="footer-link" onClick={() => navigate('/app')}>Training Programs</div>
              <div className="footer-link" onClick={() => navigate('/app')}>Skills Gap Analysis</div>
              <div className="footer-link" onClick={() => navigate('/app')}>Job Matching</div>
            </div>
            <div className="footer-col">
              <div className="footer-col-title">Resources</div>
              <div className="footer-link">TESDA Programs Guide</div>
              <div className="footer-link">Career Readiness Tips</div>
              <div className="footer-link">Resume Writing Guide</div>
              <div className="footer-link">Interview Preparation</div>
              <div className="footer-link">Scholarship Info</div>
            </div>
            <div className="footer-col">
              <div className="footer-col-title">Company</div>
              <Link to="/team" className="footer-link">Our Team</Link>
              <div className="footer-link">About GalingPH</div>
              <div className="footer-link">TESDA Partnership</div>
              <div className="footer-link">DOLE Alignment</div>
              <div className="footer-link">Contact Us</div>
            </div>
          </div>
          <div className="footer-bar">
            <div className="footer-copy">© 2024 GalingPH. Built for Filipino Youth by Tour de Force.</div>
            <div className="footer-bar-links">
              <span className="footer-bar-link">Privacy Policy</span>
              <span className="footer-bar-link">Terms of Service</span>
              <span className="footer-bar-link">Accessibility</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
