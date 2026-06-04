const Lead = require('../models/Lead');

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/leads
// Supports: search, status filter, sortBy, order, page, limit
// ─────────────────────────────────────────────────────────────────────────────
const getAllLeads = async (req, res, next) => {
  try {
    const {
      search = '',
      status = '',
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 10,
    } = req.query;

    // Build query filter
    const filter = {};

    // Search by name, email, or company (case-insensitive regex)
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by exact status value
    if (status) {
      filter.status = status;
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    // Sort direction
    const sortOrder = order === 'asc' ? 1 : -1;
    const sortOptions = { [sortBy]: sortOrder };

    // Execute query with pagination
    const [leads, totalLeads] = await Promise.all([
      Lead.find(filter).sort(sortOptions).skip(skip).limit(limitNum),
      Lead.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalLeads / limitNum);

    res.json({
      success: true,
      leads,
      totalLeads,
      totalPages,
      currentPage: pageNum,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/leads
// Validates required fields and checks for duplicate email before saving
// ─────────────────────────────────────────────────────────────────────────────
const createLead = async (req, res, next) => {
  try {
    const { name, email, phone, company, status, notes } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !company) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, phone, and company are required fields',
      });
    }

    // Check for duplicate email
    const existingLead = await Lead.findOne({ email: email.toLowerCase().trim() });
    if (existingLead) {
      return res.status(400).json({
        success: false,
        message: 'A lead with this email address already exists',
      });
    }

    const lead = await Lead.create({ name, email, phone, company, status, notes });

    res.status(201).json({
      success: true,
      message: 'Lead created successfully',
      lead,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/leads/:id
// Returns 404 if lead not found
// ─────────────────────────────────────────────────────────────────────────────
const getLeadById = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
    }

    res.json({ success: true, lead });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/leads/:id
// Updates provided fields; updatedAt is handled automatically by timestamps
// ─────────────────────────────────────────────────────────────────────────────
const updateLead = async (req, res, next) => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      {
        new: true,          // Return the updated document
        runValidators: true, // Run schema validators on update
      }
    );

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
    }

    res.json({
      success: true,
      message: 'Lead updated successfully',
      lead,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/leads/:id
// Returns success message after deletion
// ─────────────────────────────────────────────────────────────────────────────
const deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
    }

    res.json({
      success: true,
      message: 'Lead deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllLeads,
  createLead,
  getLeadById,
  updateLead,
  deleteLead,
};
