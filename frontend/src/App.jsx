import { Routes, Route } from 'react-router-dom';
import { LeadProvider } from './context/LeadContext.jsx';
import Navbar from './components/Navbar.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AddLead from './pages/AddLead.jsx';
import EditLead from './pages/EditLead.jsx';
import NotFound from './pages/NotFound.jsx';

function App() {
  return (
    <LeadProvider>
      <div className="app-wrapper">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add" element={<AddLead />} />
            <Route path="/edit/:id" element={<EditLead />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </LeadProvider>
  );
}

export default App;
