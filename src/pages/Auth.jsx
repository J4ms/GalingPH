import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';

const EyeIcon = ({ style }) => (
  <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' style={{ width: 16, height: 16, ...style }}>
    <path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z' />
    <circle cx='12' cy='12' r='3' />
  </svg>
);

const EyeOffIcon = ({ style }) => (
  <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' style={{ width: 16, height: 16, ...style }}>
    <path d='M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19' />
    <line x1='1' y1='1' x2='23' y2='23' />
  </svg>
);

export default function Auth() {
  const navigate = useNavigate();
  const { login, signup, user, loginWithSocial, logout } = useUser();
  const [mode, setMode] = useState('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    mobile: '',
    dob: '',
    gender: '',
    employment: '',
    agree: false,
  });
  const [errors, setErrors] = useState({});
  const [fade, setFade] = useState(true);
  const fadeTimer = useRef(null);
  const [socialProvider, setSocialProvider] = useState(null);
  const [socialOptions, setSocialOptions] = useState({ google: [], facebook: [] });

  const handleSocialAccountChoice = (account) => {
    setLoginError('');
    const result = loginWithSocial(account);
    if (result.success) {
      navigate('/app');
    } else {
      setLoginError(result.error || 'Social login failed.');
    }
  };

  // Test accounts for display
  const TEST_ACCOUNTS = [
    { email: 'juan@galingph.com', password: 'password123', name: 'Juan Dela Cruz' },
    { email: 'maria@galingph.com', password: 'password123', name: 'Maria Santos' },
    { email: 'test@test.com', password: 'test1234', name: 'Test User' },
    { email: 'admin@galingph.com', password: 'admin123', name: 'Admin User' },
  ];


  useEffect(() => {
    console.log('Auth mounted', { user, href: window.location.href, hash: window.location.hash, search: window.location.search });
    return () => {
      if (fadeTimer.current) {
        clearTimeout(fadeTimer.current);
      }
    };
  }, []);

  const isSignUp = mode === 'signup';

  const handleModeChange = (nextMode) => {
    if (nextMode === mode) return;
    setFade(false);
    if (fadeTimer.current) {
      clearTimeout(fadeTimer.current);
    }
    fadeTimer.current = window.setTimeout(() => {
      setMode(nextMode);
      setErrors({});
      setFade(true);
    }, 120);
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const next = {};

    if (!formData.email) {
      next.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      next.email = 'Enter a valid email address.';
    }

    if (!formData.password) {
      next.password = 'Password is required.';
    } else if (formData.password.length < 8) {
      next.password = 'Password must be at least 8 characters.';
    }

    if (isSignUp) {
      if (!formData.firstName) next.firstName = 'First name is required.';
      if (!formData.lastName) next.lastName = 'Last name is required.';
      if (!formData.confirmPassword) next.confirmPassword = 'Confirm your password.';
      if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
        next.confirmPassword = 'Passwords must match.';
      }
      if (!formData.mobile) next.mobile = 'Mobile number is required.';
      if (!formData.dob) next.dob = 'Date of birth is required.';
      if (!formData.gender) next.gender = 'Please select a gender option.';
      if (!formData.employment) next.employment = 'Please select your employment status.';
      if (!formData.agree) next.agree = 'You must agree to the Terms and Privacy Policy.';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoginError('');

    if (!validate()) return;

    if (!isSignUp) {
      const result = login(formData.email, formData.password);
      if (result.success) {
        navigate('/app');
      } else {
        setLoginError(result.error || 'Invalid email or password. Try one of the test accounts below.');
      }
    } else {
      const result = signup(formData);
      if (result.success) {
        navigate('/onboarding');
      } else {
        setLoginError(result.error || 'Sign up failed.');
      }
    }
  };

  const handleSocialLogin = (provider) => {
    setLoginError('');
    const rawRedirectUri = import.meta.env.VITE_AUTH_REDIRECT_URI || `${window.location.origin}/auth`;
    const redirectUrl = new URL(rawRedirectUri, window.location.origin);
    const redirectUri = `${redirectUrl.origin}${redirectUrl.pathname.replace(/\/$/, '')}/auth`;

    if (provider === 'google') {
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '604733788498-lnmdknsi1h9kbv7f90q46kagag32b8l0.apps.googleusercontent.com';
      const nonce = `${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`;
      const googleUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=id_token&scope=${encodeURIComponent('openid email profile')}&prompt=select_account&nonce=${encodeURIComponent(nonce)}&state=google`;
      window.location.href = googleUrl;
      return;
    }

    if (provider === 'facebook') {
      const appId = import.meta.env.VITE_FACEBOOK_APP_ID || '';
      if (!appId) {
        setLoginError('Facebook login is not configured. Please set VITE_FACEBOOK_APP_ID in your environment.');
        return;
      }
      const facebookUrl = `https://www.facebook.com/v17.0/dialog/oauth?client_id=${encodeURIComponent(appId)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=${encodeURIComponent('email,public_profile')}&auth_type=rerequest&state=facebook`;
      window.location.href = facebookUrl;
      return;
    }
  };

  useEffect(() => {
    const parseHash = (hashString) => {
      const cleaned = hashString.replace(/^#/, '');
      const params = cleaned.includes('?') ? cleaned.slice(cleaned.indexOf('?') + 1) : cleaned;
      return new URLSearchParams(params);
    };
    const parseSearch = (searchString) => new URLSearchParams(searchString.replace(/^\?/, ''));

    const handleGoogleResponse = (idToken) => {
      try {
        const payload = JSON.parse(atob(idToken.split('.')[1]));
        const account = {
          email: payload.email,
          name: payload.name || payload.email.split('@')[0],
          picture: payload.picture || '',
          provider: 'Google',
        };
        const result = loginWithSocial(account);
        if (result.success) {
          window.history.replaceState({}, document.title, '/auth');
          navigate('/app');
        }
      } catch (err) {
        console.error('Google response decode failed', err);
        setLoginError('Google login failed. Please try again.');
      }
    };

    const handleFacebookResponse = async (accessToken) => {
      try {
        const response = await fetch(`https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${encodeURIComponent(accessToken)}`);
        const data = await response.json();
        if (!response.ok || !data.email) {
          throw new Error(data.error?.message || 'Facebook login failed');
        }
        const account = {
          email: data.email,
          name: data.name || data.email.split('@')[0],
          picture: data.picture?.data?.url || '',
          provider: 'Facebook',
        };
        const result = loginWithSocial(account);
        if (result.success) {
          window.history.replaceState({}, document.title, '/auth');
          navigate('/app');
        }
      } catch (err) {
        console.error('Facebook response failed', err);
        setLoginError('Facebook login failed. Please try again.');
      }
    };

    const hashParams = parseHash(window.location.hash);
    const searchParams = parseSearch(window.location.search);
    const state = hashParams.get('state') || searchParams.get('state');
    const idToken = hashParams.get('id_token');
    const accessToken = hashParams.get('access_token') || searchParams.get('access_token');

    if (state === 'google' && idToken) {
      handleGoogleResponse(idToken);
    } else if (state === 'facebook' && accessToken) {
      handleFacebookResponse(accessToken);
    }
  }, [loginWithSocial, navigate]);

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (forgotEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) {
      setForgotSent(true);
    }
  };

  const closeForgotModal = () => {
    setShowForgotModal(false);
    setForgotEmail('');
    setForgotSent(false);
  };

  return (
    <div className='auth-screen'>
      <style>{`
        .auth-screen {
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: stretch;
          background: #F4F7FF;
        }

        .auth-shell {
          width: 100%;
          height: 100%;
          display: flex;
          min-height: 100vh;
        }

        .auth-panel {
          width: 50%;
          min-height: 100vh;
          overflow-y: auto;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 32px;
        }

        .auth-panel--left {
          background: #FFFFFF;
        }

        .auth-panel--right {
          background: linear-gradient(135deg, #3B00FF 0%, #00F5AA 100%);
          color: #FFFFFF;
          padding: 40px 36px;
        }

        .form-shell {
          width: 100%;
          max-width: 540px;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100%;
        }

        .form-panel {
          width: 100%;
          transition: opacity 180ms ease;
          opacity: 1;
        }

        .form-panel.hidden {
          opacity: 0;
        }

        .logo-box {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 10px 16px;
          border-radius: 16px;
          border: 1px dashed #DDE4F7;
          color: #3B00FF;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 18px;
          font-size: 13px;
          background: #F7F8FF;
        }

        .mode-toggle {
          display: inline-flex;
          gap: 8px;
          border-radius: 999px;
          background: #F3F6FF;
          padding: 6px;
          margin-bottom: 16px;
        }

        .mode-pill {
          border: none;
          border-radius: 999px;
          padding: 10px 18px;
          font-size: 13px;
          font-weight: 700;
          color: #12205B;
          background: transparent;
          cursor: pointer;
          transition: background 180ms ease, color 180ms ease;
        }

        .mode-pill.active {
          background: #3B00FF;
          color: #FFFFFF;
        }

        .auth-heading {
          margin: 0 0 10px;
          font-size: 30px;
          line-height: 1.05;
          color: #12205B;
          font-weight: 800;
        }

        .auth-copy {
          margin: 0 0 18px;
          color: #5B678F;
          line-height: 1.6;
          font-size: 14px;
          max-width: 460px;
        }

        .social-row {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          margin-bottom: 16px;
        }

        .social-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          height: 40px;
          border-radius: 14px;
          border: 1px solid #E6EBFF;
          background: #FFFFFF;
          color: #22304F;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: transform 180ms ease, border-color 180ms ease;
        }

        .social-button:hover {
          transform: translateY(-1px);
          border-color: #C8D1F4;
        }

        .divider {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 18px 0;
          color: #8F9DBA;
          font-size: 13px;
        }

        .divider::before,
        .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #E9EFFB;
        }

        .form-content {
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 100%;
        }

        .field-row {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .field-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        label {
          font-size: 13px;
          font-weight: 600;
          color: #2C3B69;
        }

        .auth-screen input,
        .auth-screen select {
          width: 100%;
          min-height: 38px;
          border-radius: 12px;
          border: 1px solid #D8DEEE;
          padding: 10px 12px;
          font-size: 14px;
          background: #FAFBFF;
          color: #142148;
          transition: border-color 180ms ease, box-shadow 180ms ease;
        }

        .auth-screen input:focus,
        .auth-screen select:focus {
          outline: none;
          border-color: #3B00FF;
          box-shadow: 0 0 0 4px rgba(59, 0, 255, 0.14);
        }

        .password-field {
          position: relative;
        }

        .toggle-password {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          border: none;
          background: transparent;
          color: #3B00FF;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .field-note {
          font-size: 13px;
          color: #6E7A9F;
        }

        .error-text {
          color: #B33A3A;
          font-size: 12px;
          line-height: 1.3;
        }

        .link-row {
          display: flex;
          justify-content: flex-end;
          margin-top: -2px;
          margin-bottom: 10px;
        }

        .link-button,
        .text-link {
          border: none;
          background: none;
          color: #3B00FF;
          font-weight: 700;
          cursor: pointer;
          padding: 0;
          font-size: 13px;
        }

        .link-button:hover,
        .text-link:hover {
          text-decoration: underline;
        }

        .primary-action {
          width: 100%;
          height: 44px;
          border: none;
          border-radius: 14px;
          padding: 0 16px;
          font-size: 15px;
          font-weight: 700;
          color: #FFFFFF;
          background: linear-gradient(135deg, #3B00FF 0%, #00F5AA 100%);
          box-shadow: 0 14px 26px rgba(0, 245, 170, 0.18);
          cursor: pointer;
          transition: transform 180ms ease;
        }

        .primary-action:hover {
          transform: translateY(-1px);
        }

        .footer-text {
          margin-top: 14px;
          color: #5B678F;
          font-size: 13px;
          line-height: 1.6;
        }

        .footer-text strong {
          color: #3B00FF;
          cursor: pointer;
        }

        .checkbox-row {
          display: flex;
          gap: 10px;
          align-items: flex-start;
        }

        .checkbox-row input[type='checkbox'] {
          accent-color: #3B00FF;
          width: 16px;
          height: 16px;
          margin-top: 4px;
        }

        .right-brand {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          min-height: 100%;
          width: 100%;
          padding: 16px 8px;
        }

        .right-logo {
          padding: 10px 16px;
          border: 1px solid rgba(255, 255, 255, 0.24);
          border-radius: 16px;
          color: rgba(255, 255, 255, 0.92);
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.08em;
          margin-bottom: 20px;
        }

        .tagline {
          font-size: 32px;
          line-height: 1.08;
          text-align: center;
          max-width: 420px;
          margin: 0 auto 16px;
          font-weight: 800;
        }

        .tagline-sub {
          font-size: 14px;
          opacity: 0.8;
          text-align: center;
          max-width: 340px;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* Forgot Password Modal */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 180ms ease;
        }

        .modal-box {
          background: #FFFFFF;
          border-radius: 20px;
          padding: 36px;
          width: 100%;
          max-width: 420px;
          box-shadow: 0 24px 64px rgba(0, 0, 0, 0.2);
          position: relative;
          animation: slideUp 250ms ease;
        }

        .modal-close {
          position: absolute;
          top: 16px;
          right: 16px;
          background: transparent;
          border: none;
          font-size: 20px;
          color: #8F9DBA;
          cursor: pointer;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-close:hover {
          background: #F3F6FF;
          color: #3B00FF;
        }

        .modal-title {
          font-size: 22px;
          font-weight: 700;
          color: #12205B;
          margin-bottom: 8px;
        }

        .modal-desc {
          font-size: 14px;
          color: #5B678F;
          line-height: 1.6;
          margin-bottom: 24px;
        }

        .modal-input {
          width: 100%;
          min-height: 44px;
          border-radius: 12px;
          border: 1px solid #D8DEEE;
          padding: 12px 14px;
          font-size: 14px;
          background: #FAFBFF;
          color: #142148;
          margin-bottom: 16px;
          transition: border-color 180ms ease, box-shadow 180ms ease;
        }

        .modal-input:focus {
          outline: none;
          border-color: #3B00FF;
          box-shadow: 0 0 0 4px rgba(59, 0, 255, 0.14);
        }

        .modal-btn {
          width: 100%;
          height: 44px;
          border: none;
          border-radius: 14px;
          font-size: 15px;
          font-weight: 700;
          color: #FFFFFF;
          background: linear-gradient(135deg, #3B00FF 0%, #00F5AA 100%);
          cursor: pointer;
          transition: transform 180ms ease;
        }

        .modal-btn:hover {
          transform: translateY(-1px);
        }

        .modal-success {
          text-align: center;
          padding: 16px 0;
        }

        .modal-success-icon {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(0,245,170,0.15), rgba(59,0,255,0.1));
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 900px) {
          .auth-shell {
            flex-direction: column;
          }
          .auth-panel {
            width: 100%;
            min-height: auto;
          }
          .auth-panel--right {
            display: none;
          }
        }
      `}</style>

      <div className='auth-shell'>
        {/* Left Panel — Form */}
        <div className='auth-panel auth-panel--left'>
          <div className='form-shell'>
            <div className={`form-panel${fade ? '' : ' hidden'}`}>
              <div className='logo-box'>GalingPH</div>

              {/* Mode Toggle */}
              <div className='mode-toggle'>
                <button
                  className={`mode-pill${mode === 'signin' ? ' active' : ''}`}
                  onClick={() => handleModeChange('signin')}
                >
                  Sign In
                </button>
                <button
                  className={`mode-pill${mode === 'signup' ? ' active' : ''}`}
                  onClick={() => handleModeChange('signup')}
                >
                  Sign Up
                </button>
              </div>

              <h1 className='auth-heading'>
                {isSignUp ? 'Create your account' : 'Welcome back'}
              </h1>
              <p className='auth-copy'>
                {isSignUp
                  ? 'Join GalingPH and discover your ideal career path with AI-powered guidance.'
                  : 'Sign in to continue your career journey with GalingPH.'}
              </p>

              {/* Social Buttons */}
              <div className='social-row'>
                <button className='social-button' onClick={() => handleSocialLogin('google')} type='button'>
                  <svg width='16' height='16' viewBox='0 0 24 24'>
                    <path d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z' fill='#4285F4'/>
                    <path d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z' fill='#34A853'/>
                    <path d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z' fill='#FBBC05'/>
                    <path d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z' fill='#EA4335'/>
                  </svg>
                  Sign in with Google
                </button>
                <button className='social-button' onClick={() => handleSocialLogin('facebook')} type='button'>
                  <svg width='16' height='16' viewBox='0 0 24 24' fill='#1877F2'>
                    <path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z'/>
                  </svg>
                  Facebook
                </button>
              </div>

              <div className='divider'>or continue with email</div>

              {socialProvider ? (
                <div className='social-chooser'>
                  <div className='chooser-header'>
                    <h3>Choose a {socialProvider === 'google' ? 'Google' : 'Facebook'} account</h3>
                    <button className='chooser-back' type='button' onClick={() => setSocialProvider(null)}>
                      Back
                    </button>
                  </div>
                  <div className='chooser-list'>
                    {socialOptions[socialProvider]?.map((account) => (
                      <button
                        key={account.email}
                        type='button'
                        className='chooser-option'
                        onClick={() => handleSocialAccountChoice(account)}
                      >
                        <div>
                          <strong>{account.name}</strong>
                          <div>{account.email}</div>
                        </div>
                        <span>{socialProvider === 'google' ? 'Google' : 'Facebook'}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <form onSubmit={handleSubmit}>
                    <div className='form-content'>
                      {/* Name fields (sign up only) */}
                      {isSignUp && (
                        <div className='field-row'>
                          <div className='field-group'>
                            <label>First Name</label>
                            <input
                              name='firstName'
                              value={formData.firstName}
                              onChange={handleChange}
                              placeholder='Juan'
                            />
                            {errors.firstName && <span className='error-text'>{errors.firstName}</span>}
                          </div>
                          <div className='field-group'>
                            <label>Last Name</label>
                            <input
                              name='lastName'
                              value={formData.lastName}
                              onChange={handleChange}
                              placeholder='Dela Cruz'
                            />
                            {errors.lastName && <span className='error-text'>{errors.lastName}</span>}
                          </div>
                        </div>
                      )}

                      {/* Email */}
                      <div className='field-group'>
                        <label>Email Address</label>
                        <input
                          name='email'
                          type='email'
                          value={formData.email}
                          onChange={handleChange}
                          placeholder='you@example.com'
                        />
                        {errors.email && <span className='error-text'>{errors.email}</span>}
                      </div>

                      {/* Password */}
                      <div className='field-group'>
                        <label>Password</label>
                        <div className='password-field'>
                          <input
                            name='password'
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={handleChange}
                            placeholder='At least 8 characters'
                          />
                          <button type='button' className='toggle-password' onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                          </button>
                        </div>
                        {errors.password && <span className='error-text'>{errors.password}</span>}
                      </div>

                      {/* Confirm Password (sign up only) */}
                      {isSignUp && (
                        <div className='field-group'>
                          <label>Confirm Password</label>
                          <div className='password-field'>
                            <input
                              name='confirmPassword'
                              type={showConfirm ? 'text' : 'password'}
                              value={formData.confirmPassword}
                              onChange={handleChange}
                              placeholder='Re-enter your password'
                            />
                            <button type='button' className='toggle-password' onClick={() => setShowConfirm(!showConfirm)}>
                              {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
                            </button>
                          </div>
                          {errors.confirmPassword && <span className='error-text'>{errors.confirmPassword}</span>}
                        </div>
                      )}

                      {/* Mobile (sign up only) */}
                      {isSignUp && (
                        <div className='field-group'>
                          <label>Mobile Number</label>
                          <input
                            name='mobile'
                            type='tel'
                            value={formData.mobile}
                            onChange={handleChange}
                            placeholder='+63 9XX XXX XXXX'
                          />
                          {errors.mobile && <span className='error-text'>{errors.mobile}</span>}
                        </div>
                      )}

                      {/* DOB & Gender (sign up only) */}
                      {isSignUp && (
                        <div className='field-row'>
                          <div className='field-group'>
                            <label>Date of Birth</label>
                            <input
                              name='dob'
                              type='date'
                              value={formData.dob}
                              onChange={handleChange}
                            />
                            {errors.dob && <span className='error-text'>{errors.dob}</span>}
                          </div>
                          <div className='field-group'>
                            <label>Gender</label>
                            <select name='gender' value={formData.gender} onChange={handleChange}>
                              <option value=''>Select</option>
                              <option value='male'>Male</option>
                              <option value='female'>Female</option>
                              <option value='other'>Prefer not to say</option>
                            </select>
                            {errors.gender && <span className='error-text'>{errors.gender}</span>}
                          </div>
                        </div>
                      )}

                      {/* Employment (sign up only) */}
                      {isSignUp && (
                        <div className='field-group'>
                          <label>Employment Status</label>
                          <select name='employment' value={formData.employment} onChange={handleChange}>
                            <option value=''>Select your status</option>
                            <option value='student'>Student</option>
                            <option value='unemployed'>Unemployed</option>
                            <option value='underemployed'>Underemployed</option>
                            <option value='first-time'>First-time Jobseeker</option>
                            <option value='employed'>Employed</option>
                          </select>
                          {errors.employment && <span className='error-text'>{errors.employment}</span>}
                        </div>
                      )}

                      {/* Forgot password (sign in only) */}
                      {!isSignUp && (
                        <div className='link-row'>
                          <button type='button' className='link-button' onClick={() => setShowForgotModal(true)}>Forgot password?</button>
                        </div>
                      )}

                      {/* Terms checkbox (sign up only) */}
                      {isSignUp && (
                        <div className='checkbox-row'>
                          <input
                            type='checkbox'
                            name='agree'
                            checked={formData.agree}
                            onChange={handleChange}
                          />
                          <span className='field-note'>
                            I agree to the <span className='text-link'>Terms of Service</span> and <span className='text-link'>Privacy Policy</span>.
                          </span>
                        </div>
                      )}
                      {errors.agree && <span className='error-text'>{errors.agree}</span>}

                      {/* Submit */}
                      <button type='submit' className='primary-action'>
                        {isSignUp ? 'Create Account' : 'Sign In'}
                      </button>

                      {/* Login error */}
                      {loginError && (
                        <div style={{ background: '#FFF0F0', border: '1px solid #FFD4D4', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#B33A3A', lineHeight: 1.5 }}>
                          {loginError}
                        </div>
                      )}

                      {/* Test accounts hint (sign in only) */}
                      {!isSignUp && (
                        <div style={{ background: '#F3F6FF', border: '1px dashed #DDE4F7', borderRadius: 12, padding: '14px 16px', marginTop: 4 }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: '#3B00FF', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                            Test Accounts
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {TEST_ACCOUNTS.map(acc => (
                              <div
                                key={acc.email}
                                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: '#5B678F', cursor: 'pointer', padding: '4px 0' }}
                                onClick={() => { setFormData(prev => ({ ...prev, email: acc.email, password: acc.password })); setLoginError(''); }}
                              >
                                <span><strong style={{ color: '#2C3B69' }}>{acc.name}</strong></span>
                                <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#8F9DBA' }}>{acc.email}</span>
                              </div>
                            ))}
                          </div>
                          <div style={{ fontSize: 11, color: '#8F9DBA', marginTop: 8 }}>
                            Password for all: <code style={{ background: '#E6EBFF', padding: '2px 6px', borderRadius: 4, fontSize: 11 }}>password123</code> (or <code style={{ background: '#E6EBFF', padding: '2px 6px', borderRadius: 4, fontSize: 11 }}>test1234</code> for test@test.com)
                          </div>
                        </div>
                      )}
                    </div>
                  </form>
                </div>
              )}

              <p className='footer-text'>
                {isSignUp ? (
                  <>Already have an account? <strong onClick={() => handleModeChange('signin')}>Sign In</strong></>
                ) : (
                  <>Don&apos;t have an account? <strong onClick={() => handleModeChange('signup')}>Sign Up Free</strong></>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel — Branding */}
        <div className='auth-panel auth-panel--right'>
          <div className='right-brand'>
            <div className='right-logo'>GALINGPH</div>
            <div>
              <div className='tagline'>Your Career Path, Powered by AI.</div>
              <p className='tagline-sub'>
                Join thousands of Filipino youth mapping their future with AI-powered career intelligence.
              </p>
            </div>
            <div style={{ fontSize: 12, opacity: 0.6 }}>TESDA-Aligned · Free to Use · Filipino-Built</div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className='modal-overlay' onClick={closeForgotModal}>
          <div className='modal-box' onClick={e => e.stopPropagation()}>
            <button className='modal-close' onClick={closeForgotModal}>✕</button>

            {!forgotSent ? (
              <>
                <div className='modal-title'>Reset your password</div>
                <p className='modal-desc'>
                  Enter the email address associated with your account and we&apos;ll send you a link to reset your password.
                </p>
                <form onSubmit={handleForgotSubmit}>
                  <input
                    className='modal-input'
                    type='email'
                    placeholder='Enter your email address'
                    value={forgotEmail}
                    onChange={e => setForgotEmail(e.target.value)}
                    autoFocus
                  />
                  <button type='submit' className='modal-btn'>Send Reset Link</button>
                </form>
              </>
            ) : (
              <div className='modal-success'>
                <div className='modal-success-icon'>
                  <svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='#3B00FF' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'>
                    <polyline points='20 6 9 17 4 12'/>
                  </svg>
                </div>
                <div className='modal-title'>Check your email</div>
                <p className='modal-desc'>
                  We&apos;ve sent a password reset link to <strong style={{ color: '#3B00FF' }}>{forgotEmail}</strong>. Please check your inbox.
                </p>
                <button className='modal-btn' onClick={closeForgotModal}>Back to Sign In</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
