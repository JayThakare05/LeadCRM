import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import { useLeads } from '../context/LeadContext.jsx';
import LeadForm from '../components/LeadForm.jsx';

const AddLead = () => {
  const navigate = useNavigate();
  const { addLead } = useLeads();

  const handleSubmit = async (formData) => {
    await addLead(formData);
    toast.success('Lead created successfully! 🎉');
    navigate('/');
  };

  return (
    <div className="page-container">
      {/* Back button */}
      <button className="back-btn" onClick={() => navigate('/')}>
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <div className="page-header">
        <h1 className="page-title">Add New Lead</h1>
        <p className="page-subtitle">
          Fill in the details below to add a new lead to your pipeline.
        </p>
      </div>

      <div className="form-card card">
        <LeadForm mode="create" onSubmit={handleSubmit} />
      </div>

      <style>{`
        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: none;
          border: none;
          font-family: var(--font-family);
          font-size: 14px;
          font-weight: 500;
          color: var(--color-text-secondary);
          cursor: pointer;
          padding: 0;
          margin-bottom: 20px;
          transition: var(--transition);
        }
        .back-btn:hover {
          color: var(--color-accent);
        }
        .form-card {
          padding: 32px;
          max-width: 800px;
        }
        @media (max-width: 768px) {
          .form-card {
            padding: 20px 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default AddLead;
