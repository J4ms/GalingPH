import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { readStorage, removeStorage, subscribeToStorage, writeStorage } from './storage';

const UserContext = createContext();

// Test accounts with pre-filled data
const TEST_ACCOUNTS = [
  { email: 'juan@galingph.com', password: 'password123', name: 'Juan Dela Cruz', role: 'user' },
  { email: 'maria@galingph.com', password: 'password123', name: 'Maria Santos', role: 'user' },
  { email: 'test@test.com', password: 'test1234', name: 'Test User', role: 'user' },
  { email: 'admin@galingph.com', password: 'admin123', name: 'Admin User', role: 'admin' },
];

// Pre-filled data for test accounts so they aren't empty
const TEST_ANALYSIS = {
  'juan@galingph.com': {
    fileName: 'juan_resume.pdf',
    extractedSkills: ['JavaScript', 'React.js', 'Node.js', 'Git', 'HTML/CSS', 'Problem Solving', 'Communication', 'Teamwork'],
    readinessScore: 82,
    recommendedCareers: [
      { name: 'Software Engineer', match: '94%' },
      { name: 'Web Developer', match: '81%' },
      { name: 'IT Support Specialist', match: '72%' },
    ],
    analyzedAt: '5/10/2025, 2:30:00 PM',
  },
  'maria@galingph.com': {
    fileName: 'maria_cv.pdf',
    extractedSkills: ['Microsoft Office', 'Data Entry', 'Customer Service', 'Accounting', 'Communication', 'Time Management'],
    readinessScore: 68,
    recommendedCareers: [
      { name: 'Bookkeeper', match: '85%' },
      { name: 'Administrative Assistant', match: '78%' },
      { name: 'Customer Service Rep', match: '71%' },
    ],
    analyzedAt: '5/8/2025, 10:15:00 AM',
  },
  'admin@galingph.com': {
    fileName: 'admin_resume.pdf',
    extractedSkills: ['Leadership', 'Project Management', 'React.js', 'Node.js', 'System Design', 'SQL', 'Communication', 'Agile', 'DevOps'],
    readinessScore: 91,
    recommendedCareers: [
      { name: 'Software Engineer', match: '96%' },
      { name: 'Project Manager', match: '89%' },
      { name: 'System Architect', match: '84%' },
    ],
    analyzedAt: '5/12/2025, 9:00:00 AM',
  },
};

const TEST_NOTIFICATIONS = {
  'juan@galingph.com': [
    { id: 1, text: 'AI analysis updated your match score to 94%', time: '2 hours ago', read: false },
    { id: 2, text: 'New TESDA course recommendation: Web Dev NC III', time: 'Yesterday', read: false },
    { id: 3, text: 'Resume "juan_resume.pdf" analysed — 8 skills extracted', time: '3 days ago', read: true },
  ],
  'maria@galingph.com': [
    { id: 1, text: 'Resume "maria_cv.pdf" analysed — 6 skills extracted', time: '1 week ago', read: false },
    { id: 2, text: 'New career match: Bookkeeper (85%)', time: '1 week ago', read: true },
  ],
  'admin@galingph.com': [
    { id: 1, text: 'System update: 3 new users registered today', time: '1 hour ago', read: false },
    { id: 2, text: 'Resume analysed — 9 skills extracted', time: '2 days ago', read: true },
  ],
};

// Helper to get per-user storage key
function getUserKey(email, suffix) {
  return `galingph-${email}-${suffix}`;
}

function getDefaultProfile(user) {
  return {
    displayName: user?.name || '',
    email: user?.email || '',
    bio: '',
    location: '',
    targetRole: '',
    picture: user?.picture || '',
  };
}

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = readStorage('galingph-user');
    return stored ? stored : null;
  });

  const [allUsers, setAllUsers] = useState(() => {
    const stored = readStorage('galingph-all-users');
    return stored ? stored : TEST_ACCOUNTS.map(a => ({ ...a, createdAt: '2024-01-15', status: 'active' }));
  });

  // Per-user data — loaded based on current user
  const [notifications, setNotifications] = useState([]);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [profileSettings, setProfileSettings] = useState(() => getDefaultProfile(user));
  const [profileStorageReady, setProfileStorageReady] = useState(false);

  // Load user-specific data when user changes
  useEffect(() => {
    setProfileStorageReady(false);
    if (user?.email) {
      const storedNotif = readStorage(getUserKey(user.email, 'notifications'));
      const storedAnalysis = readStorage(getUserKey(user.email, 'analysis'));
      const storedProfile = readStorage(getUserKey(user.email, 'profile'));

      if (storedNotif) {
        setNotifications(storedNotif);
      } else {
        // Load test data for test accounts, empty for new users
        setNotifications(TEST_NOTIFICATIONS[user.email] || []);
      }

      if (storedAnalysis) {
        setAnalysisResult(storedAnalysis);
      } else {
        // Load test data for test accounts, null for new users
        setAnalysisResult(TEST_ANALYSIS[user.email] || null);
      }

      if (storedProfile) {
        setProfileSettings({ ...getDefaultProfile(user), ...storedProfile });
      } else {
        setProfileSettings(getDefaultProfile(user));
      }
      setProfileStorageReady(true);
    } else {
      setNotifications([]);
      setAnalysisResult(null);
      setProfileSettings(getDefaultProfile(null));
      setProfileStorageReady(false);
    }
  }, [user]);

  // Save user to localStorage
  useEffect(() => {
    if (user) writeStorage('galingph-user', user);
    else removeStorage('galingph-user');
  }, [user]);

  // Save per-user notifications
  useEffect(() => {
    if (user?.email) {
      writeStorage(getUserKey(user.email, 'notifications'), notifications);
    }
  }, [notifications, user?.email]);

  // Save per-user analysis
  useEffect(() => {
    if (user?.email) {
      if (analysisResult) {
        writeStorage(getUserKey(user.email, 'analysis'), analysisResult);
      } else {
        removeStorage(getUserKey(user.email, 'analysis'));
      }
    }
  }, [analysisResult, user?.email]);

  // Save per-user profile settings
  useEffect(() => {
    if (user?.email && profileStorageReady) {
      writeStorage(getUserKey(user.email, 'profile'), profileSettings);
    }
  }, [profileSettings, profileStorageReady, user?.email]);

  // Save all users list
  useEffect(() => {
    writeStorage('galingph-all-users', allUsers);
  }, [allUsers]);

  const addNotification = useCallback((text) => {
    setNotifications(prev => [{ id: Date.now(), text, time: 'Just now', read: false }, ...prev]);
  }, []);

  const updateProfileSettings = useCallback((updates) => {
    setProfileSettings(prev => ({ ...prev, ...updates }));
  }, []);

  const login = (email, password) => {
    const account = allUsers.find(
      a => a.email.toLowerCase() === email.toLowerCase() && a.password === password
    );
    if (account) {
      setUser({ name: account.name, email: account.email, role: account.role || 'user' });
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password.' };
  };

  const loginWithGoogle = (googleUser) => {
    const existing = allUsers.find(a => a.email.toLowerCase() === googleUser.email.toLowerCase());
    if (existing) {
      setUser({ name: existing.name, email: existing.email, role: existing.role || 'user', picture: googleUser.picture || '' });
    } else {
      const newUser = { email: googleUser.email, name: googleUser.name, password: '', role: 'user', createdAt: new Date().toISOString().split('T')[0], status: 'active' };
      setAllUsers(prev => [...prev, newUser]);
      setUser({ name: googleUser.name, email: googleUser.email, role: 'user', picture: googleUser.picture || '' });
    }
    return { success: true };
  };

  const loginWithSocial = (account) => {
    if (!account || !account.email) {
      return { success: false, error: 'No account selected.' };
    }
    const existing = allUsers.find(a => a.email.toLowerCase() === account.email.toLowerCase());
    if (existing) {
      setUser({ name: existing.name, email: existing.email, role: existing.role || 'user', picture: account.picture || '' });
    } else {
      const newUser = {
        email: account.email,
        name: account.name,
        password: '',
        role: 'user',
        createdAt: new Date().toISOString().split('T')[0],
        status: 'active',
      };
      setAllUsers(prev => [...prev, newUser]);
      setUser({ name: account.name, email: account.email, role: 'user', picture: account.picture || '' });
    }
    return { success: true };
  };

  const signup = (userData) => {
    const exists = allUsers.find(a => a.email.toLowerCase() === userData.email.toLowerCase());
    if (exists) return { success: false, error: 'Email already registered.' };
    const newUser = { ...userData, role: 'user', createdAt: new Date().toISOString().split('T')[0], status: 'active' };
    setAllUsers(prev => [...prev, newUser]);
    setUser({ name: `${userData.firstName} ${userData.lastName}`, email: userData.email, role: 'user' });
    return { success: true };
  };

  const logout = () => {
    // Don't clear per-user data — just switch user to null
    setUser(null);
  };

  const markNotificationRead = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // AI Resume Analysis (simulated)
  const analyzeResume = (fileName) => {
    const skills = ['HTML/CSS', 'JavaScript', 'React.js', 'Git', 'Communication', 'Problem Solving', 'Teamwork', 'Microsoft Office', 'Data Entry', 'Customer Service', 'Time Management', 'Adaptability'];
    const randomSkills = skills.sort(() => 0.5 - Math.random()).slice(0, 6 + Math.floor(Math.random() * 5));
    const result = {
      fileName,
      extractedSkills: randomSkills,
      readinessScore: 55 + Math.floor(Math.random() * 35),
      recommendedCareers: [
        { name: 'Software Engineer', match: '94%' },
        { name: 'Web Developer', match: '81%' },
        { name: 'IT Support Specialist', match: '72%' },
      ],
      analyzedAt: new Date().toLocaleString(),
    };
    setAnalysisResult(result);
    addNotification(`Resume "${fileName}" analysed — ${randomSkills.length} skills extracted`);
    return result;
  };

  const analyzeCertificate = (fileName) => {
    const certs = ['NC II Programming', 'NC II Computer Systems Servicing', 'NC II Electrical Installation', 'NC III Web Development', 'NC II Cookery', 'NC II Automotive Servicing'];
    const detected = certs[Math.floor(Math.random() * certs.length)];
    addNotification(`Certificate "${fileName}" verified — ${detected} detected`);
    if (analysisResult) {
      setAnalysisResult(prev => ({
        ...prev,
        extractedSkills: [...new Set([...prev.extractedSkills, detected])],
        readinessScore: Math.min(100, prev.readinessScore + 5),
      }));
    } else {
      setAnalysisResult({
        fileName,
        extractedSkills: [detected],
        readinessScore: 30,
        recommendedCareers: [
          { name: 'TESDA Trainer', match: '79%' },
          { name: 'Electrician', match: '65%' },
        ],
        analyzedAt: new Date().toLocaleString(),
      });
    }
    return { detected };
  };

  const syncScanAnalysis = ({ fileNames = [], resultText = '', model = '', analysis = {} }) => {
    const extractedSkills = Array.isArray(analysis.skillsDetected) ? analysis.skillsDetected.filter(Boolean) : [];
    const recommendedCareers = Array.isArray(analysis.careerMatches) && analysis.careerMatches.length
      ? analysis.careerMatches.map((career, index) => ({
          name: career.name || `Career Match ${index + 1}`,
          match: career.match || `${Math.max(55, 88 - index * 7)}%`,
        }))
      : [
          { name: 'TESDA Skills Explorer', match: '70%' },
          { name: 'Career Discovery Track', match: '65%' },
        ];

    const readinessScore = Math.min(96, Math.max(35, 45 + extractedSkills.length * 6 - (analysis.skillGaps?.length || 0) * 2));
    const result = {
      fileName: fileNames.join(', ') || 'AI scan upload',
      extractedSkills,
      readinessScore,
      recommendedCareers,
      skillGaps: Array.isArray(analysis.skillGaps) ? analysis.skillGaps : [],
      tesdaRecommendations: Array.isArray(analysis.tesdaRecommendations) ? analysis.tesdaRecommendations : [],
      nextActions: Array.isArray(analysis.nextActions) ? analysis.nextActions : [],
      scanSummary: analysis.summary || '',
      scanResultText: resultText,
      scanModel: model,
      analyzedAt: new Date().toLocaleString(),
      source: 'AI Scanner',
    };

    setAnalysisResult(result);
    addNotification(`AI scan synced "${result.fileName}" — ${extractedSkills.length || 'no'} skills detected`);
    return result;
  };

  // Admin functions
  const deleteUser = (email) => {
    setAllUsers(prev => prev.filter(u => u.email !== email));
    // Also clean up their stored data
    removeStorage(getUserKey(email, 'notifications'));
    removeStorage(getUserKey(email, 'analysis'));
  };

  const toggleUserStatus = (email) => {
    setAllUsers(prev => prev.map(u => u.email === email ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u));
  };

  return (
    <UserContext.Provider value={{
      user, login, loginWithGoogle, loginWithSocial, signup, logout,
      notifications, markNotificationRead, clearAllNotifications, addNotification,
      analyzeResume, analyzeCertificate, syncScanAnalysis, analysisResult,
      profileSettings, updateProfileSettings,
      allUsers, deleteUser, toggleUserStatus,
      isAdmin: user?.role === 'admin',
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
}
