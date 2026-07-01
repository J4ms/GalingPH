import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../ThemeContext';

const teamMembers = [
  {
    name: 'James Chua',
    role: 'Project Manager & Developer',
    description: 'Leads project management and contributes to full-stack development, ensuring timely delivery and quality across all sprints.',
    skills: ['Leadership', 'React', 'Node.js', 'Agile'],
    initials: 'JC',
  },
  {
    name: 'Angelo Urgelles',
    role: 'UX Designer & Documenter',
    description: 'Designs intuitive interfaces and crafts clear documentation for seamless user experiences across web and mobile.',
    skills: ['Figma', 'UI/UX', 'Docs', 'Research'],
    initials: 'AU',
  },
  {
    name: 'Kevin Victorio',
    role: 'Full-Stack Developer',
    description: 'Focuses on frontend and backend development, building the core features and ensuring a polished, performant product.',
    skills: ['React', 'Python', 'APIs', 'Database'],
    initials: 'KV',
  },
  {
    name: 'Renz Cabugao',
    role: 'System Analyst & Backend',
    description: 'Architects the backend infrastructure, designs system flows, and ensures smooth data operations at scale.',
    skills: ['System Design', 'SQL', 'APIs', 'Security'],
    initials: 'RC',
  },
  {
    name: 'Lydia Dela Cruz',
    role: 'Documenter & Frontend',
    description: 'Crafts clear technical documentation and contributes to frontend development with attention to accessibility.',
    skills: ['Technical Writing', 'HTML/CSS', 'A11y', 'QA'],
    initials: 'LD',
  },
];

const SunIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
    <circle cx="12" cy="12" r="5" />
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
);

const MoonIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

export default function Team() {
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const cardRefs = useRef([]);

  useEffect(() => {
    const observers = [];
    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      const obs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => { el.style.animationDelay = `${i * 0.1}s`; el.classList.add('animate-fade-up'); }, 50);
        }
      }, { threshold: 0.1 });
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  return (
    <div className="team-page">
      {/* Top bar */}
      <div className="team-topbar">
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800 }}>
          <span className="grad-text">GalingPH</span>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button onClick={toggle} className="theme-toggle" style={{ width: 40, height: 40 }} aria-label="Toggle theme">
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
          <Link to="/" className="cta-secondary" style={{ height: 40, padding: '0 18px', fontSize: 13 }}>
            ← Back to Home
          </Link>
        </div>
      </div>

      {/* Header */}
      <div className="team-header">
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 640, margin: '0 auto' }}>
          <div className="eyebrow" style={{ marginBottom: 16 }}>The People Behind GalingPH</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.15, marginBottom: 16 }}>
            Meet <span className="grad-text">Tour de Force</span>
          </h1>
          <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 520, margin: '0 auto' }}>
            Five creators blending product strategy, design, and engineering to build a career intelligence platform for Filipino youth.
          </p>
        </div>
      </div>

      {/* Team Grid */}
      <div className="team-grid">
        {teamMembers.map((member, i) => (
          <div
            key={member.name}
            className="team-card"
            ref={el => cardRefs.current[i] = el}
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="team-card-avatar">
              {member.initials}
            </div>
            <div className="team-card-name">{member.name}</div>
            <div className="team-card-role">{member.role}</div>
            <p className="team-card-desc">{member.description}</p>
            <div className="team-card-skills">
              {member.skills.map(s => (
                <span key={s} className="badge badge-green" style={{ fontSize: 10 }}>{s}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Stats section */}
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 40px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          {[
            { num: '5', label: 'Team Members' },
            { num: '3', label: 'Months Development' },
            { num: '83+', label: 'TESDA Programs Mapped' },
            { num: '100%', label: 'Filipino-Built' },
          ].map((stat, i) => (
            <div key={stat.label} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '24px 20px', textAlign: 'center', transition: 'transform 0.2s, border-color 0.2s' }} className="hover-lift">
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 32, fontWeight: 700, marginBottom: 4 }} className="grad-text">{stat.num}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
