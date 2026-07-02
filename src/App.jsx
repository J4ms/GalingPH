import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './ThemeContext';
import { UserProvider } from './UserContext';
import Landing from './pages/Landing';
import Onboarding from './pages/Onboarding';
import MobileApp from './pages/MobileApp';
import Team from './pages/Team';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import AiScanner from './pages/AiScanner';
import './index.css';

export default function App() {
  return (
    <UserProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/app" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/scanner" element={<AiScanner />} />
            <Route path="/mobile" element={<MobileApp />} />
            <Route path="/team" element={<Team />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </UserProvider>
  );
}
