import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';

const MAX_INLINE_BYTES = 18 * 1024 * 1024;

const UploadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const ScanIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 7V5a2 2 0 0 1 2-2h2" />
    <path d="M17 3h2a2 2 0 0 1 2 2v2" />
    <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
    <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
    <line x1="7" y1="12" x2="17" y2="12" />
  </svg>
);

const FileIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const formatBytes = (bytes) => {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
};

const toBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(String(reader.result).split(',')[1]);
  reader.onerror = reject;
  reader.readAsDataURL(file);
});

const readTextFile = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(String(reader.result));
  reader.onerror = reject;
  reader.readAsText(file);
});

async function scanFiles({ files, goal }) {
  const payloadFiles = [];

  for (const file of files) {
    if (file.size > MAX_INLINE_BYTES) continue;

    if (file.type.startsWith('text/') || /\.(csv|json|md|txt)$/i.test(file.name)) {
      const text = await readTextFile(file);
      payloadFiles.push({ kind: 'text', name: file.name, type: file.type || 'text/plain', text });
      continue;
    }

    payloadFiles.push({
      kind: 'inline',
      name: file.name,
      type: file.type || 'application/octet-stream',
      data: await toBase64(file),
    });
  }

  if (payloadFiles.length === 0) {
    throw new Error(`All selected files were larger than ${formatBytes(MAX_INLINE_BYTES)}.`);
  }

  const response = await fetch('/api/scan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ goal, files: payloadFiles }),
  });

  const payload = await response.json();
  if (!response.ok) throw new Error(payload?.error || 'AI scan failed.');
  return {
    result: payload.result || 'No scan text was returned.',
    analysis: payload.analysis || {},
    model: payload.model || '',
  };
}

export default function AiScanner({ embedded = false }) {
  const navigate = useNavigate();
  const { user, syncScanAnalysis, profileSettings } = useUser();
  const [files, setFiles] = useState([]);
  const [goal, setGoal] = useState('Extract useful details, detect document type, and summarize any visible skills or certificates.');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [syncedAt, setSyncedAt] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [now, setNow] = useState(() => new Date());
  const profile = useMemo(() => ({
    name: profileSettings?.displayName || user?.name || '',
    email: profileSettings?.email || user?.email || '',
    location: profileSettings?.location || '',
    role: profileSettings?.targetRole || '',
    photo: profileSettings?.picture || user?.picture || '',
  }), [profileSettings, user]);

  const previews = useMemo(() => files.map((file) => ({
    file,
    url: file.type.startsWith('image/') ? URL.createObjectURL(file) : '',
  })), [files]);

  useEffect(() => () => {
    previews.forEach(({ url }) => {
      if (url) URL.revokeObjectURL(url);
    });
  }, [previews]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!isScanning) return undefined;

    setScanProgress(8);
    const interval = window.setInterval(() => {
      setScanProgress(prev => {
        if (prev < 45) return prev + 7;
        if (prev < 78) return prev + 4;
        if (prev < 92) return prev + 1;
        return prev;
      });
    }, 360);

    return () => window.clearInterval(interval);
  }, [isScanning]);

  const handleFiles = (event) => {
    setFiles(Array.from(event.target.files || []));
    setResult('');
    setError('');
    setSyncedAt('');
    setScanProgress(0);
  };

  const handleScan = async () => {
    if (!files.length) {
      setError('Choose at least one file or picture to scan.');
      return;
    }

    setIsScanning(true);
    setScanProgress(8);
    setError('');
    setResult('');

    try {
      const profileContext = [
        profile.name && `Name: ${profile.name}`,
        profile.email && `Email: ${profile.email}`,
        profile.location && `Location: ${profile.location}`,
        profile.role && `Target role: ${profile.role}`,
      ].filter(Boolean).join('\n');
      const scanGoal = profileContext ? `${goal}\n\nUser profile context:\n${profileContext}` : goal;
      const scanPayload = await scanFiles({ files, goal: scanGoal });
      setResult(scanPayload.result);
      syncScanAnalysis?.({
        fileNames: files.map((file) => file.name),
        resultText: scanPayload.result,
        model: scanPayload.model,
        analysis: scanPayload.analysis,
      });
      setSyncedAt(new Date().toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' }));
      setScanProgress(100);
    } catch (scanError) {
      setError(scanError instanceof Error ? scanError.message : 'Unable to scan these files.');
      setScanProgress(100);
    } finally {
      window.setTimeout(() => setIsScanning(false), 450);
    }
  };

  const formattedTime = now.toLocaleTimeString('en-PH', {
    timeZone: 'Asia/Manila',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const formattedDate = now.toLocaleDateString('en-PH', {
    timeZone: 'Asia/Manila',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className={`scanner-page${embedded ? ' scanner-page--embedded' : ''}`}>
      {!embedded && (
        <header className="scanner-topbar">
          <button type="button" className="scanner-logo" onClick={() => navigate('/') }>
            <span className="grad-text">GalingPH</span>
          </button>
          <div className="scanner-clock" aria-label="Current Manila date and time">
            <strong>{formattedTime}</strong>
            <span>{formattedDate}</span>
          </div>
        </header>
      )}

      <main className={`scanner-shell${embedded ? ' scanner-shell--embedded' : ''}`}>
        <section className="scanner-hero">
          <div>
            <div className="eyebrow">Google AI File Scanner</div>
            <h1>Scan user-selected files and pictures with AI.</h1>
            <p>Upload resumes, certificates, screenshots, PDFs, and text files. The scanner sends only the selected files to Google AI and returns a structured summary.</p>
          </div>
          <div className="scanner-privacy">
            <ShieldIcon />
            <div>
              <strong>User consent required</strong>
              <span>Browsers cannot scan private device folders automatically. Users must choose each file before analysis.</span>
            </div>
          </div>
        </section>

        <section className="scanner-grid">
          <div className="scanner-panel">
            <label className="scanner-label" htmlFor="scan-goal">Scan goal</label>
            <textarea id="scan-goal" value={goal} onChange={(event) => setGoal(event.target.value)} rows={4} className="scanner-textarea" />

            <label className="scanner-dropzone">
              <input type="file" multiple accept="image/*,.pdf,.txt,.md,.csv,.json" onChange={handleFiles} />
              <span className="scanner-upload-icon"><UploadIcon /></span>
              <strong>Choose files or pictures</strong>
              <small>Images, PDF, TXT, CSV, JSON, and Markdown work best.</small>
            </label>

            <button className="btn-primary scanner-action" onClick={handleScan} disabled={isScanning || !files.length}>
              <ScanIcon />
              {isScanning ? 'Scanning...' : 'Scan with Secure AI'}
            </button>
            {(isScanning || scanProgress > 0) && (
              <div className="scanner-progress" aria-label="Scan progress">
                <div className="scanner-progress-head">
                  <span>{isScanning ? 'Reading upload and matching skills' : 'Scan complete'}</span>
                  <strong>{scanProgress}%</strong>
                </div>
                <div className="scanner-progress-track">
                  <div className="scanner-progress-fill" style={{ width: `${scanProgress}%` }} />
                </div>
              </div>
            )}

          </div>

          <div className="scanner-panel">
            <div className="scanner-panel-title">Profile</div>
            <div className="scanner-profile-photo scanner-profile-photo--readonly">
              {profile.photo ? <img src={profile.photo} alt={profile.name || 'Profile'} /> : <span>{(profile.name || 'U').slice(0, 1).toUpperCase()}</span>}
              <div>
                <strong>Profile synced</strong>
                <small>Edit your picture and details from My Profile in the top-right menu.</small>
              </div>
            </div>
            <div className="scanner-profile-form">
              <label>Name<input value={profile.name} readOnly placeholder="Your name" /></label>
              <label>Email<input value={profile.email} readOnly placeholder="you@example.com" /></label>
              <label>Location<input value={profile.location} readOnly placeholder="City, Province" /></label>
              <label>Target role<input value={profile.role} readOnly placeholder="Example: Web Developer" /></label>
            </div>

            <div className="scanner-panel-title scanner-files-title">Selected Files</div>
            {files.length === 0 ? (
              <div className="scanner-empty">No files selected yet.</div>
            ) : (
              <div className="scanner-file-list">
                {previews.map(({ file, url }) => (
                  <div key={`${file.name}-${file.lastModified}`} className="scanner-file-row">
                    {url ? <img src={url} alt={file.name} /> : <span className="scanner-file-icon"><FileIcon /></span>}
                    <div>
                      <strong>{file.name}</strong>
                      <span>{file.type || 'Unknown type'} - {formatBytes(file.size)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {(result || error) && (
          <section className="scanner-results">
            <div className="scanner-panel-title">{error ? 'Scan Error' : 'AI Scan Result'}</div>
            {!error && syncedAt && <div className="scanner-sync-note">Synced to Career Paths, Skills Gap, and TESDA recommendations at {syncedAt}.</div>}
            <pre className={error ? 'scanner-error' : ''}>{error || result}</pre>
          </section>
        )}
      </main>
    </div>
  );
}
