const mongoose = require('mongoose');

/**
 * Lead Schema — represents a sales lead/customer in the CRM.
 * Includes indexes on email (unique), status, and name for faster queries.
 */
const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ['New', 'Contacted', 'Qualified', 'Converted', 'Lost'],
        message: 'Status must be one of: New, Contacted, Qualified, Converted, Lost',
      },
      default: 'New',
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
      default: '',
    },
  },
  {
    // Automatically manages createdAt and updatedAt timestamps
    timestamps: true,
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
// email is already indexed as unique above
leadSchema.index({ status: 1 });
leadSchema.index({ name: 1 });

const Lead = mongoose.model('Lead', leadSchema);

module.exports = Lead;
