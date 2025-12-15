// models/propertyLawModels.js
const mongoose = require('mongoose');

const legalTermSchema = new mongoose.Schema({
  term: String,
  definition: String,
  example: String,
  category: String,
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });

const inheritanceRuleSchema = new mongoose.Schema({
  religion: String,
  maleHeir: [String],
  femaleHeir: [String],
  spouse: String,
  specialNotes: [String],
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });

const documentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  useCase: { type: String },
  format: { type: String },
  requirements: [{ type: String }],
  templateUrl: { type: String },
  fileName: { type: String },       // <-- New field
  fileSize: { type: Number },       // <-- New field
  fileType: { type: String },       // <-- New field
  downloadCount: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });

const farmerRightSchema = new mongoose.Schema({
  title: String,
  description: String,
  details: [String],
  category: String,
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });

const LegalTerm = mongoose.model('LegalTerm', legalTermSchema);
const InheritanceRule = mongoose.model('InheritanceRule', inheritanceRuleSchema);
const LegalDocument = mongoose.model('LegalDocument', documentSchema);
const FarmerRight = mongoose.model('FarmerRight', farmerRightSchema);

module.exports = {
  LegalTerm,
  InheritanceRule,
  LegalDocument,
  FarmerRight
};
