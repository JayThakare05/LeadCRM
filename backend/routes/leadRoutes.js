const express = require('express');
const router = express.Router();
const {
  getAllLeads,
  createLead,
  getLeadById,
  updateLead,
  deleteLead,
} = require('../controllers/leadController');

const { protect } = require('../middleware/authMiddleware');

// ─── Lead Routes ──────────────────────────────────────────────────────────────
// All routes are mounted at /api/leads in server.js

router.use(protect);

router.route('/')
  .get(getAllLeads)   // GET  /api/leads — list with search/filter/sort/paginate
  .post(createLead); // POST /api/leads — create a new lead

router.route('/:id')
  .get(getLeadById)    // GET    /api/leads/:id — get single lead
  .put(updateLead)     // PUT    /api/leads/:id — update lead
  .delete(deleteLead); // DELETE /api/leads/:id — delete lead

module.exports = router;
