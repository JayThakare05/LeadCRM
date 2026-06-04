import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';

/* ─── LeadCRM SVG Icon ───────────────────────────────────────────────────── */
const CRMIcon = ({ size = 48, color = '#ffffff' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4"  y="28" width="8" height="16" rx="2" fill={color} opacity="0.85"/>
    <rect x="16" y="18" width="8" height="26" rx="2" fill={color}/>
    <rect x="28" y="10" width="8" height="34" rx="2" fill={color} opacity="0.85"/>
    <path d="M40 8 L44 4 M44 4 L44 10 M44 4 L38 4"
      stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 26 L18 16 L30 8 L42 4"
      stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
  </svg>
);

/* ─── Icon SVG helpers ───────────────────────────────────────────────────── */
const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="8" r="4"/>
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
  </svg>
);
const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 6 9 17l-5-5"/>
  </svg>
);

/**
 * AuthPage — Sliding panel auth UI.
 *
 * HOW THE SLIDE WORKS:
 * - Card is split 50/50: left half (Register) and right half (Login).
 * - A purple overlay brand panel sits on TOP with position:absolute, width 50%.
 * - Login mode (Default): Brand panel is on the left (translateX(0)). It covers the Register form.
 *   The Login form is visible on the right.
 * - Register mode: Brand panel slides to the right (translateX(100%)). It covers the Login form.
 *   The Register form is visible on the left.
 * - The transition duration is set to exactly 1.0s with a premium easing curve (cubic-bezier(0.76, 0, 0.24, 1)).
 * - Form wraps and brand text also transition simultaneously, creating a beautiful parallax feel.
 */
const AuthPage = () => {
  const [mode, setMode] = useState('login'); // 'login' | 'register'

  const [loginForm,    setLoginForm]    = useState({ username: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ username: '', password: '', confirm: '' });
  const [loginErrors,  setLoginErrors]  = useState({});
  const [regErrors,    setRegErrors]    = useState({});
  const [loginLoading, setLoginLoading] = useState(false);
  const [regLoading,   setRegLoading]   = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const isLogin = mode === 'login';

  /* ── Switch — just flip the mode; CSS handles the slide ───────────────── */
  const switchMode = (next) => {
    if (next === mode) return;
    setMode(next);
    // Clear errors on switch
    setLoginErrors({});
    setRegErrors({});
  };

  /* ── Login ─────────────────────────────────────────────────────────────── */
  const handleLogin = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!loginForm.username.trim()) errs.username = 'Username is required';
    if (!loginForm.password)        errs.password = 'Password is required';
    if (Object.keys(errs).length)   { setLoginErrors(errs); return; }
    setLoginLoading(true);
    try {
      await login(loginForm.username, loginForm.password);
      toast.success(`Welcome back, ${loginForm.username}! 👋`);
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Try again.';
      toast.error(msg);
      setLoginErrors({ submit: msg });
    } finally { setLoginLoading(false); }
  };

  /* ── Register ──────────────────────────────────────────────────────────── */
  const handleRegister = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!registerForm.username.trim())                           errs.username = 'Username is required';
    else if (registerForm.username.length < 3)                   errs.username = 'Min 3 characters';
    if (!registerForm.password)                                  errs.password = 'Password is required';
    else if (registerForm.password.length < 6)                   errs.password = 'Min 6 characters';
    if (!registerForm.confirm)                                   errs.confirm  = 'Confirm your password';
    else if (registerForm.confirm !== registerForm.password)     errs.confirm  = 'Passwords do not match';
    if (Object.keys(errs).length) { setRegErrors(errs); return; }
    setRegLoading(true);
    try {
      await register(registerForm.username, registerForm.password);
      toast.success(`Account created! Welcome, ${registerForm.username} 🎉`);
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Try again.';
      toast.error(msg);
      setRegErrors({ submit: msg });
    } finally { setRegLoading(false); }
  };

  /* ── Render ────────────────────────────────────────────────────────────── */
  return (
    <div className="ap-page">
      {/* Demo Credentials Info Badge */}
      <div className="ap-demo-badge">
        <span className="ap-demo-title">Demo Credentials</span>
        <div className="ap-demo-row">
          <span>Username:</span> <strong>test</strong>
        </div>
        <div className="ap-demo-row">
          <span>Password:</span> <strong>test123</strong>
        </div>
      </div>

      <div className={`ap-card ${isLogin ? '' : 'ap-register-mode'}`}>

        {/* ── Left half — Register form ─────────────────────────── */}
        <div className="ap-half ap-half-left">
          <div className="ap-form-wrap">
            <div className="ap-form-head">
              <h2 className="ap-title">Create account</h2>
              <p className="ap-subtitle">Start managing your leads today</p>
            </div>
            <form className="ap-form" onSubmit={handleRegister} noValidate>
              {regErrors.submit && <div className="ap-err-banner">{regErrors.submit}</div>}

              <div className="ap-field">
                <label className="ap-label" htmlFor="r-user">Username</label>
                <div className="ap-input-box">
                  <span className="ap-ico"><UserIcon /></span>
                  <input id="r-user" type="text" autoComplete="username"
                    className={`ap-input ${regErrors.username ? 'ap-input-err' : ''}`}
                    placeholder="Choose a username"
                    value={registerForm.username}
                    onChange={e => { setRegisterForm(p => ({...p, username: e.target.value})); setRegErrors(p => ({...p, username:''})); }}
                  />
                </div>
                {regErrors.username && <span className="ap-ferr">{regErrors.username}</span>}
              </div>

              <div className="ap-field">
                <label className="ap-label" htmlFor="r-pass">Password</label>
                <div className="ap-input-box">
                  <span className="ap-ico"><LockIcon /></span>
                  <input id="r-pass" type="password" autoComplete="new-password"
                    className={`ap-input ${regErrors.password ? 'ap-input-err' : ''}`}
                    placeholder="Min 6 characters"
                    value={registerForm.password}
                    onChange={e => { setRegisterForm(p => ({...p, password: e.target.value})); setRegErrors(p => ({...p, password:''})); }}
                  />
                </div>
                {regErrors.password && <span className="ap-ferr">{regErrors.password}</span>}
              </div>

              <div className="ap-field">
                <label className="ap-label" htmlFor="r-conf">Confirm Password</label>
                <div className="ap-input-box">
                  <span className="ap-ico"><CheckIcon /></span>
                  <input id="r-conf" type="password" autoComplete="new-password"
                    className={`ap-input ${regErrors.confirm ? 'ap-input-err' : ''}`}
                    placeholder="Re-enter password"
                    value={registerForm.confirm}
                    onChange={e => { setRegisterForm(p => ({...p, confirm: e.target.value})); setRegErrors(p => ({...p, confirm:''})); }}
                  />
                </div>
                {regErrors.confirm && <span className="ap-ferr">{regErrors.confirm}</span>}
              </div>

              <button type="submit" className="ap-btn" disabled={regLoading}>
                {regLoading && <span className="ap-spin"/>}
                {regLoading ? 'Creating…' : 'Create Account'}
              </button>

              {/* Mobile only toggle */}
              <p className="ap-mobile-toggle">
                Have an account?{' '}
                <button type="button" onClick={() => switchMode('login')}>Sign in</button>
              </p>
            </form>
          </div>
        </div>

        {/* ── Right half — Login form ─────────────────────────────── */}
        <div className="ap-half ap-half-right">
          <div className="ap-form-wrap">
            <div className="ap-form-head">
              <h2 className="ap-title">Welcome back</h2>
              <p className="ap-subtitle">Sign in to your LeadCRM account</p>
            </div>
            <form className="ap-form" onSubmit={handleLogin} noValidate>
              {loginErrors.submit && <div className="ap-err-banner">{loginErrors.submit}</div>}

              <div className="ap-field">
                <label className="ap-label" htmlFor="l-user">Username</label>
                <div className="ap-input-box">
                  <span className="ap-ico"><UserIcon /></span>
                  <input id="l-user" type="text" autoComplete="username"
                    className={`ap-input ${loginErrors.username ? 'ap-input-err' : ''}`}
                    placeholder="Enter your username"
                    value={loginForm.username}
                    onChange={e => { setLoginForm(p => ({...p, username: e.target.value})); setLoginErrors(p => ({...p, username:''})); }}
                  />
                </div>
                {loginErrors.username && <span className="ap-ferr">{loginErrors.username}</span>}
              </div>

              <div className="ap-field">
                <label className="ap-label" htmlFor="l-pass">Password</label>
                <div className="ap-input-box">
                  <span className="ap-ico"><LockIcon /></span>
                  <input id="l-pass" type="password" autoComplete="current-password"
                    className={`ap-input ${loginErrors.password ? 'ap-input-err' : ''}`}
                    placeholder="Enter your password"
                    value={loginForm.password}
                    onChange={e => { setLoginForm(p => ({...p, password: e.target.value})); setLoginErrors(p => ({...p, password:''})); }}
                  />
                </div>
                {loginErrors.password && <span className="ap-ferr">{loginErrors.password}</span>}
              </div>

              <button type="submit" className="ap-btn" disabled={loginLoading}>
                {loginLoading && <span className="ap-spin"/>}
                {loginLoading ? 'Signing in…' : 'Sign In'}
              </button>

              {/* Mobile only toggle */}
              <p className="ap-mobile-toggle">
                No account?{' '}
                <button type="button" onClick={() => switchMode('register')}>Create one</button>
              </p>
            </form>
          </div>
        </div>

        {/* ── Sliding purple brand panel — sits on top, slides left/right ── */}
        <div className="ap-brand-panel">
          <div className="ap-brand-inner">
            {/* Decorative blobs */}
            <div className="ap-blob ap-blob-1"/>
            <div className="ap-blob ap-blob-2"/>
            <div className="ap-blob ap-blob-3"/>

            {/* Login Mode Brand Content (Visible when mode === 'login') */}
            <div className={`ap-brand-content ap-brand-content-login ${isLogin ? 'ap-active' : 'ap-inactive'}`}>
              <div className="ap-brand-logo">
                <CRMIcon size={48} color="#ffffff"/>
              </div>
              <h1 className="ap-brand-name">LeadCRM</h1>
              <p className="ap-brand-tag">
                Manage your leads.{"\n"}Close more deals.
              </p>
              <div className="ap-brand-cta">
                <p className="ap-brand-cta-label">Don't have an account?</p>
                <button
                  type="button"
                  className="ap-brand-switch"
                  onClick={() => switchMode('register')}
                >
                  Create Account
                </button>
              </div>
            </div>

            {/* Register Mode Brand Content (Visible when mode === 'register') */}
            <div className={`ap-brand-content ap-brand-content-register ${!isLogin ? 'ap-active' : 'ap-inactive'}`}>
              <div className="ap-brand-logo">
                <CRMIcon size={48} color="#ffffff"/>
              </div>
              <h1 className="ap-brand-name">LeadCRM</h1>
              <p className="ap-brand-tag">
                Join thousands of{"\n"}sales teams today.
              </p>
              <div className="ap-brand-cta">
                <p className="ap-brand-cta-label">Already have an account?</p>
                <button
                  type="button"
                  className="ap-brand-switch"
                  onClick={() => switchMode('login')}
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ── All CSS ────────────────────────────────────────────────────────── */}
      <style>{`
        /* PAGE */
        .ap-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
          font-family: var(--font-family, 'Inter', system-ui, sans-serif);
          position: relative;
        }

        /* DEMO BADGE */
        .ap-demo-badge {
          position: absolute;
          top: 24px;
          left: 24px;
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 10px 14px;
          border-radius: 12px;
          color: #fff;
          font-size: 13px;
          z-index: 100;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .ap-demo-title {
          font-weight: 700;
          text-transform: uppercase;
          font-size: 10px;
          letter-spacing: 0.05em;
          color: #c7d2fe;
          margin-bottom: 2px;
        }
        .ap-demo-row {
          display: flex;
          justify-content: space-between;
          gap: 12px;
        }
        .ap-demo-row span {
          opacity: 0.75;
        }

        /* CARD */
        .ap-card {
          position: relative;
          width: 100%;
          max-width: 900px;
          min-height: 600px;
          background: #fff;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 30px 80px rgba(0,0,0,0.25);
          display: flex;
          transform: translateZ(0);
          isolation: isolate;
        }

        /* ── HALVES ──────────────────────────────────────────────────────── */
        .ap-half {
          width: 50%;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 52px 48px;
          position: relative;
          z-index: 1;
        }
        .ap-half-left  { /* Register side (on left) */ }
        .ap-half-right { /* Login side (on right) */ }

        /* FORM WRAPPERS & SLIDING EFFECTS */
        .ap-form-wrap {
          width: 100%;
          max-width: 320px;
          transition: transform 1.0s cubic-bezier(0.76, 0, 0.24, 1), opacity 1.0s cubic-bezier(0.76, 0, 0.24, 1);
          will-change: transform, opacity;
        }

        /* Register form (left side) transition:
           - In login mode: Hidden under brand panel on left, offset left by -50px, opacity 0.
           - In register mode: Revealed, slides to center (0), opacity 1.
        */
        .ap-half-left .ap-form-wrap {
          transform: translateX(-50px);
          opacity: 0;
          pointer-events: none;
        }
        .ap-register-mode .ap-half-left .ap-form-wrap {
          transform: translateX(0);
          opacity: 1;
          pointer-events: auto;
        }

        /* Login form (right side) transition:
           - In login mode: Revealed, slides to center (0), opacity 1.
           - In register mode: Hidden under brand panel on right, offset right by 50px, opacity 0.
        */
        .ap-half-right .ap-form-wrap {
          transform: translateX(0);
          opacity: 1;
          pointer-events: auto;
        }
        .ap-register-mode .ap-half-right .ap-form-wrap {
          transform: translateX(50px);
          opacity: 0;
          pointer-events: none;
        }

        .ap-form-head { margin-bottom: 30px; }

        .ap-title {
          font-size: 26px;
          font-weight: 700;
          color: #1f2937;
          letter-spacing: -0.03em;
          margin-bottom: 6px;
        }
        .ap-subtitle {
          font-size: 14px;
          color: #6b7280;
        }

        /* FORM */
        .ap-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .ap-field {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .ap-label {
          font-size: 12.5px;
          font-weight: 600;
          color: #374151;
        }
        .ap-input-box {
          position: relative;
        }
        .ap-ico {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
          display: flex;
          align-items: center;
          pointer-events: none;
        }
        .ap-input {
          width: 100%;
          padding: 11px 14px 11px 40px;
          font-family: inherit;
          font-size: 14px;
          color: #1f2937;
          background: #f9fafb;
          border: 1.5px solid #e5e7eb;
          border-radius: 10px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }
        .ap-input::placeholder { color: #c4c9d4; }
        .ap-input:focus {
          border-color: #4f46e5;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(79,70,229,0.12);
        }
        .ap-input.ap-input-err {
          border-color: #ef4444;
          box-shadow: 0 0 0 3px rgba(239,68,68,0.1);
        }
        .ap-ferr {
          font-size: 11.5px;
          color: #ef4444;
        }
        .ap-err-banner {
          padding: 10px 14px;
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
          border-radius: 8px;
          font-size: 13px;
        }

        /* BUTTON */
        .ap-btn {
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          color: #fff;
          border: none;
          border-radius: 10px;
          font-family: inherit;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 14px rgba(79,70,229,0.35);
          letter-spacing: 0.01em;
          margin-top: 4px;
        }
        .ap-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 22px rgba(79,70,229,0.45);
        }
        .ap-btn:disabled { opacity: 0.65; cursor: not-allowed; }

        /* SPINNER */
        .ap-spin {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: ap-rotate 0.7s linear infinite;
          display: inline-block;
          flex-shrink: 0;
        }
        @keyframes ap-rotate {
          to { transform: rotate(360deg); }
        }

        /* MOBILE TOGGLE (hidden on desktop) */
        .ap-mobile-toggle {
          display: none;
          text-align: center;
          font-size: 13px;
          color: #6b7280;
          margin-top: 2px;
        }
        .ap-mobile-toggle button {
          background: none;
          border: none;
          color: #4f46e5;
          font-weight: 600;
          cursor: pointer;
          font-size: 13px;
          font-family: inherit;
          padding: 0;
        }

        /* ═══════════════════════════════════════════════════════════════════
           BRAND PANEL — THE SLIDING OVERLAY (50% wide)
           ═══════════════════════════════════════════════════════════════════
           - Login mode:  slides to left (translateX(0))
           - Register mode: slides to right (translateX(100%))
        */
        .ap-brand-panel {
          position: absolute;
          top: 0;
          left: 0;
          width: 50%;
          height: 100%;
          background: linear-gradient(150deg, #4338ca 0%, #6d28d9 55%, #a855f7 100%);
          z-index: 10;
          /* GPU-accelerated 1s sliding translation */
          transform: translateX(0);
          transition: transform 1.0s cubic-bezier(0.76, 0, 0.24, 1);
          will-change: transform;
        }

        .ap-register-mode .ap-brand-panel {
          transform: translateX(100%);
        }

        .ap-brand-inner {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        /* BRAND CONTENT ANIMATIONS */
        .ap-brand-content {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 40px 32px;
          box-sizing: border-box;
          transition: transform 1.0s cubic-bezier(0.76, 0, 0.24, 1), opacity 1.0s cubic-bezier(0.76, 0, 0.24, 1);
          will-change: transform, opacity;
          z-index: 2;
        }

        /* Login brand content transitions:
           - In login mode: Active, centered (translateX(0)), opacity 1.
           - In register mode: Inactive, slides left (translateX(-80px)), opacity 0.
        */
        .ap-brand-content-login.ap-active {
          transform: translateX(0);
          opacity: 1;
          pointer-events: auto;
        }
        .ap-brand-content-login.ap-inactive {
          transform: translateX(-80px);
          opacity: 0;
          pointer-events: none;
        }

        /* Register brand content transitions:
           - In login mode: Inactive, slides right (translateX(80px)), opacity 0.
           - In register mode: Active, centered (translateX(0)), opacity 1.
        */
        .ap-brand-content-register.ap-active {
          transform: translateX(0);
          opacity: 1;
          pointer-events: auto;
        }
        .ap-brand-content-register.ap-inactive {
          transform: translateX(80px);
          opacity: 0;
          pointer-events: none;
        }

        /* Decorative blobs */
        .ap-blob {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.07);
          pointer-events: none;
        }
        .ap-blob-1 { width: 220px; height: 220px; top: -60px; right: -60px; }
        .ap-blob-2 { width: 160px; height: 160px; bottom: -40px; left: -40px; }
        .ap-blob-3 { width: 100px; height: 100px; top: 40%; left: -30px; background: rgba(255, 255, 255, 0.05); }

        /* Logo box */
        .ap-brand-logo {
          width: 88px;
          height: 88px;
          background: rgba(255, 255, 255, 0.14);
          border: 1.5px solid rgba(255, 255, 255, 0.22);
          border-radius: 26px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 22px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
          backdrop-filter: blur(6px);
        }

        .ap-brand-name {
          font-size: 30px;
          font-weight: 800;
          letter-spacing: -0.04em;
          margin-bottom: 12px;
          color: #fff;
        }
        .ap-brand-tag {
          font-size: 14px;
          opacity: 0.82;
          line-height: 1.65;
          white-space: pre-line;
          margin-bottom: 40px;
          max-width: 220px;
        }

        /* CTA */
        .ap-brand-cta { display: flex; flex-direction: column; align-items: center; gap: 12px; }
        .ap-brand-cta-label {
          font-size: 13px;
          opacity: 0.75;
          color: #fff;
          margin: 0;
        }
        .ap-brand-switch {
          padding: 10px 30px;
          background: rgba(255, 255, 255, 0.14);
          color: #fff;
          border: 2px solid rgba(255, 255, 255, 0.45);
          border-radius: 100px;
          font-size: 14px;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s, transform 0.2s;
          backdrop-filter: blur(4px);
          letter-spacing: 0.02em;
        }
        .ap-brand-switch:hover {
          background: rgba(255, 255, 255, 0.24);
          border-color: rgba(255, 255, 255, 0.75);
          transform: scale(1.04);
        }

        @media (max-width: 680px) {
          .ap-page {
            flex-direction: column;
            padding: 40px 16px;
            min-height: 100vh;
            height: auto;
            justify-content: center;
          }
          .ap-demo-badge {
            position: relative;
            top: auto;
            left: auto;
            margin-bottom: 16px;
            align-self: center;
            width: 100%;
            max-width: 420px;
            box-sizing: border-box;
          }
          .ap-card {
            flex-direction: column;
            max-width: 420px;
            min-height: unset;
            border-radius: 16px;
          }
          .ap-brand-panel {
            display: none !important;
          }
          .ap-half {
            width: 100%;
            padding: 40px 24px;
          }
          .ap-form-wrap {
            transform: none !important;
            opacity: 1 !important;
            transition: none !important;
          }
          /* Show/hide forms according to mode */
          .ap-half-left {
            display: none;
          }
          .ap-half-right {
            display: flex;
          }
          .ap-register-mode .ap-half-left {
            display: flex;
          }
          .ap-register-mode .ap-half-right {
            display: none;
          }
          .ap-mobile-toggle {
            display: block;
          }
          .ap-blob {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default AuthPage;
