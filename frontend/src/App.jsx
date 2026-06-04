import { Routes, Route, Navigate } from 'react-router-dom';
import { LeadProvider } from './context/LeadContext.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AddLead from './pages/AddLead.jsx';
import EditLead from './pages/EditLead.jsx';
import NotFound from './pages/NotFound.jsx';
import AuthPage from './pages/AuthPage.jsx';

/**
 * PrivateRoute — redirects to /login if user is not authenticated.
 */
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

/**
 * PublicRoute — redirects to / if user is already logged in.
 */
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/" replace /> : children;
};

/**
 * Inner app rendered after auth is established.
 */
const AppInner = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="app-wrapper">
      {isAuthenticated && <Navbar />}
      <main className={isAuthenticated ? 'main-content' : ''}>
        <Routes>
          {/* Public route — auth page */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <AuthPage />
              </PublicRoute>
            }
          />

          {/* Protected routes — require login */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <LeadProvider>
                  <Dashboard />
                </LeadProvider>
              </PrivateRoute>
            }
          />
          <Route
            path="/add"
            element={
              <PrivateRoute>
                <LeadProvider>
                  <AddLead />
                </LeadProvider>
              </PrivateRoute>
            }
          />
          <Route
            path="/edit/:id"
            element={
              <PrivateRoute>
                <LeadProvider>
                  <EditLead />
                </LeadProvider>
              </PrivateRoute>
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}

export default App;
