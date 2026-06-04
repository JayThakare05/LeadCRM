import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import { useLeads } from '../context/LeadContext.jsx';
import { getLeadById } from '../api/leadApi.js';
import LeadForm from '../components/LeadForm.jsx';
import Loader from '../components/Loader.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const EditLead = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { editLead } = useLeads();
  const { user } = useAuth();

  const [leadData, setLeadData]   = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError]     = useState(null);

  // ── Fetch lead by ID on mount ──────────────────────────────────────────────
  useEffect(() => {
    const loadLead = async () => {
      try {
        const data = await getLeadById(id);
        setLeadData(data.lead);
      } catch (err) {
        setFetchError(
          err.response?.data?.message || 'Lead not found or could not be loaded'
        );
      } finally {
        setFetchLoading(false);
      }
    };
    loadLead();
  }, [id]);

  const handleSubmit = async (formData) => {
    await editLead(id, formData);
    toast.success('Lead updated successfully! ✅');
    navigate('/');
  };

  // ── Loading state ──────────────────────────────────────────────────────────
  if (fetchLoading) return <Loader />;

  // ── Error state ────────────────────────────────────────────────────────────
  if (fetchError) {
    return (
      <div className="page-container">
        <div className="error-state">
          <p>⚠️ {fetchError}</p>
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/')}
            style={{ marginTop: '16px' }}
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Back button */}
      <button className="back-btn" onClick={() => navigate('/')}>
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      {leadData && (() => {
        const leadCreatorId = leadData.createdBy?._id || leadData.createdBy;
        const currentUserId = user?.id || user?._id;
        const canModify = currentUserId && leadCreatorId && leadCreatorId.toString() === currentUserId.toString();

        return (
          <>
            <div className="page-header">
              <h1 className="page-title">{canModify ? 'Edit Lead' : 'Lead Details'}</h1>
              <p className="page-subtitle">
                {canModify
                  ? `Update the details for ${leadData.name}`
                  : `Viewing details for ${leadData.name}`}
              </p>
            </div>

            <div className="form-card card">
              <LeadForm
                mode="edit"
                initialData={leadData}
                onSubmit={handleSubmit}
                readOnly={!canModify}
              />
            </div>
          </>
        );
      })()}

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
        .error-state {
          padding: 32px;
          text-align: center;
          color: var(--color-danger);
          font-size: 15px;
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

export default EditLead;
