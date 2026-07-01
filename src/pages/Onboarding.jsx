import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../ThemeContext';

const SunIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
    <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
  </svg>
);

const MoonIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

const UploadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 28, height: 28 }}>
    <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 12, height: 12 }}>
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16, flexShrink: 0 }}>
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const CAREERS = [
  'Software Engineer', 'Electrician', 'Bookkeeper', 'Web Developer',
  'Healthcare Worker', 'Entrepreneur', 'Graphic Designer', 'TESDA Trainer',
];

const EDUCATION_OPTIONS = ['High School Graduate', 'College Undergraduate', 'College Graduate', 'Vocational Graduate'];
const STATUS_OPTIONS = ['Student', 'Unemployed', 'Underemployed', 'First-time jobseeker'];

const SETUP_ITEMS = [
  'Tell us about yourself',
  'Set your dream career',
  'Upload your resume',
  'Upload your certificates',
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { theme, toggle } = useTheme();
  const [step, setStep] = useState(1);
  const [career, setCareer] = useState('');
  const [careerSearch, setCareerSearch] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [certFiles, setCertFiles] = useState([]);
  const [completing, setCompleting] = useState(false);
  const resumeRef = useRef();
  const certRef = useRef();

  const progress = ((step - 1) / 4) * 100;

  const handleFinish = () => {
    setCompleting(true);
    setTimeout(() => navigate('/app'), 2400);
  };

  const filteredCareers = CAREERS.filter(c =>
    c.toLowerCase().includes(careerSearch.toLowerCase())
  );

  if (completing) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-page)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
        <svg width="80" height="80" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="36" fill="none" stroke="var(--border)" strokeWidth="3" />
          <circle cx="40" cy="40" r="36" fill="none" stroke="url(#cg)" strokeWidth="3"
            strokeDasharray="226" strokeDashoffset="226"
            style={{ animation: 'drawCheck 0.8s ease forwards', strokeLinecap: 'round' }}
          />
          <defs>
            <linearGradient id="cg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00F5AA" />
              <stop offset="100%" stopColor="#3B00FF" />
            </linearGradient>
          </defs>
          <polyline
            points="26,42 36,52 56,30"
            fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray="50" strokeDashoffset="50"
            style={{ animation: 'drawCheck 0.5s ease 0.6s forwards' }}
          />
        </svg>
        <p style={{ fontSize: 16, color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}>
          Setting up your profile...
        </p>
      </div>
    );
  }

  return (
    <div className="onboarding-shell">
      {/* Fixed progress bar */}
      <div className="progress-bar-fixed">
        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* Top bar */}
      <div style={{
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 800 }}>
          <span className="grad-text">GalingPH</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="step-indicator" style={{ margin: 0 }}>Step {step} of 4</div>
          <button className="theme-toggle" onClick={toggle}>
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </div>

      <div className="onboarding-inner">
        <div className="onboarding-panel">

          {/* ── STEP 1: WELCOME ── */}
          {step === 1 && (
            <div className="ob-step">
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: 12 }}>
                Welcome to GalingPH,{' '}
                <span className="grad-text">Juan.</span>
              </h1>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 28 }}>
                Let's set up your profile so we can find the best career path for you. This takes about 2 minutes.
              </p>
              <div className="checklist">
                {SETUP_ITEMS.map((item, i) => (
                  <div key={item} className="checklist-item">
                    <div className={`check-circle${i < step - 1 ? ' done' : ''}`}>
                      {i < step - 1 && <CheckIcon />}
                    </div>
                    {item}
                  </div>
                ))}
              </div>
              <button className="btn-full" onClick={() => setStep(2)}>Let's Go →</button>
            </div>
          )}

          {/* ── STEP 2: BASIC INFO ── */}
          {step === 2 && (
            <div className="ob-step">
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>
                Tell us about yourself.
              </h2>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 36 }}>
                This helps us personalise your career recommendations.
              </p>

              <div className="form-field">
                <label className="form-label">Full Name</label>
                <input className="form-input" type="text" defaultValue="Juan dela Cruz" placeholder="Your full name" />
              </div>
              <div className="form-field">
                <label className="form-label">Age</label>
                <input className="form-input" type="number" placeholder="e.g. 22" />
              </div>
              <div className="form-field">
                <label className="form-label">Location</label>
                <input className="form-input" type="text" placeholder="City, Province" />
              </div>
              <div className="form-field">
                <label className="form-label">Highest Education</label>
                <select className="form-input">
                  <option value="">Select education level</option>
                  {EDUCATION_OPTIONS.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="form-field">
                <label className="form-label">Current Status</label>
                <select className="form-input">
                  <option value="">Select your status</option>
                  {STATUS_OPTIONS.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>

              <div className="ob-nav">
                <button className="btn-back" onClick={() => setStep(1)}>← Back</button>
                <button className="cta-primary" style={{ height: 44, padding: '0 28px', fontSize: 14 }} onClick={() => setStep(3)}>
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: CAREER GOAL ── */}
          {step === 3 && (
            <div className="ob-step">
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>
                Where do you want to go?
              </h2>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 28 }}>
                Pick a dream career. You can change this anytime.
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '10px 14px', marginBottom: 24 }}>
                <SearchIcon />
                <input
                  style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: 15, color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}
                  placeholder="Search a career..."
                  value={careerSearch}
                  onChange={e => setCareerSearch(e.target.value)}
                />
              </div>

              <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
                Popular Careers
              </div>

              <div className="career-pills">
                {filteredCareers.map(c => (
                  <button
                    key={c}
                    className={`career-pill${career === c ? ' selected' : ''}`}
                    onClick={() => { setCareer(c); setCareerSearch(c); }}
                  >
                    {c}
                  </button>
                ))}
              </div>

              <div className="ob-nav">
                <button className="btn-back" onClick={() => setStep(2)}>← Back</button>
                <button className="cta-primary" style={{ height: 44, padding: '0 28px', fontSize: 14 }} onClick={() => setStep(4)}>
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 4: UPLOAD ── */}
          {step === 4 && (
            <div className="ob-step">
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>
                Upload your documents.
              </h2>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 28 }}>
                We'll use these to analyse your skills and generate your career readiness score.
              </p>

              {/* Resume */}
              <div
                className={`upload-zone${resumeFile ? ' has-file' : ''}`}
                onClick={() => !resumeFile && resumeRef.current?.click()}
              >
                <input
                  ref={resumeRef} type="file" accept=".pdf,.docx" hidden
                  onChange={e => setResumeFile(e.target.files[0])}
                />
                {resumeFile ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 2 }}>{resumeFile.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{(resumeFile.size / 1024).toFixed(0)} KB</div>
                    </div>
                    <button onClick={e => { e.stopPropagation(); setResumeFile(null); }} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 18 }}>×</button>
                  </div>
                ) : (
                  <>
                    <div className="upload-icon"><UploadIcon /></div>
                    <div className="upload-label">Drop your resume here or <span className="upload-link">browse</span></div>
                    <div className="upload-hint">PDF or DOCX · max 5MB</div>
                  </>
                )}
              </div>

              {/* Certificates */}
              <div
                className={`upload-zone${certFiles.length > 0 ? ' has-file' : ''}`}
                onClick={() => certRef.current?.click()}
              >
                <input
                  ref={certRef} type="file" accept=".pdf,.jpg,.png" multiple hidden
                  onChange={e => setCertFiles(prev => [...prev, ...Array.from(e.target.files)])}
                />
                {certFiles.length > 0 ? (
                  <div style={{ width: '100%', textAlign: 'left' }}>
                    <div style={{ fontSize: 12, color: 'var(--accent)', fontFamily: 'var(--font-mono)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {certFiles.length} certificate{certFiles.length > 1 ? 's' : ''} added
                    </div>
                    {certFiles.map((f, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid var(--border)', fontSize: 13, color: 'var(--text-secondary)' }}>
                        <span>{f.name}</span>
                        <button onClick={e => { e.stopPropagation(); setCertFiles(prev => prev.filter((_, j) => j !== i)); }} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>×</button>
                      </div>
                    ))}
                    <div style={{ marginTop: 10, fontSize: 12, color: 'var(--accent)', cursor: 'pointer' }}>+ Add more</div>
                  </div>
                ) : (
                  <>
                    <div className="upload-icon"><UploadIcon /></div>
                    <div className="upload-label">Drop your TESDA certificates here or <span className="upload-link">browse</span></div>
                    <div className="upload-hint">PDF or image · multiple files supported</div>
                  </>
                )}
              </div>

              <div style={{ textAlign: 'center', marginBottom: 8 }}>
                <button onClick={() => setStep(5)} style={{ background: 'transparent', border: 'none', fontSize: 13, color: 'var(--text-muted)', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                  Skip for now →
                </button>
              </div>

              <button
                className="btn-full"
                style={{ opacity: (resumeFile || certFiles.length > 0) ? 1 : 0.45, cursor: (resumeFile || certFiles.length > 0) ? 'pointer' : 'not-allowed' }}
                onClick={handleFinish}
                disabled={!resumeFile && certFiles.length === 0}
              >
                Finish Setup &amp; Analyse →
              </button>

              <div className="ob-nav" style={{ marginTop: 16 }}>
                <button className="btn-back" onClick={() => setStep(3)}>← Back</button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
