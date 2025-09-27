import mongoose from "mongoose";

// ✅ Author Subdocument Schema (only affiliation now)
const AuthorSchema = new mongoose.Schema({
  affiliation: { type: String, required: [true, 'Author affiliation is required'] },
}, { _id: false });

// ✅ Reference Subdocument Schema (optional DOI)
const ReferenceSchema = new mongoose.Schema({
  text: { type: String, required: [true, 'Reference text is required'] },
  doi: { type: String, trim: true }
}, { _id: false });

// ✅ Utility: Validate at least one author
function arrayLimit(val) {
  return Array.isArray(val) && val.length > 0;
}

// ✅ Main Research Paper Schema
const ResearchPaperSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Title is required'],
    trim: true
  },
  authors: {
    type: [AuthorSchema],
    required: [true, 'At least one author is required'], 
    validate: {
      validator: arrayLimit,
      message: 'At least one author is required'
    }
  },
  abstract: { 
    type: String, 
    required: [true, 'Abstract is required']
  },
  keywords: [{ 
    type: String, 
    trim: true 
  }],
  introduction: { 
    type: String, 
    required: [true, 'Introduction is required']
  },
  objective: {
    type: String,
    required: [true, 'Objective section is required']
  },
  methodology: {
    type: String,
    required: [true, 'Methodology section is required']
  },
  experimentalResults: {
    type: String,
    required: [true, 'Experimental results section is required']
  },
  discussion: {
    type: String,
    required: [true, 'Discussion section is required']
  },
  conclusion: {
    type: String,
    required: [true, 'Conclusion section is required']
  },
  references: [ReferenceSchema],
  publicationDate: {
    type: Date,
    required: [true, 'Publication date is required']
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  downloads: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  category: { 
    type: String, 
    enum: [
      "Business",
      "Psychology",
      "Design",
      "Technology",
      "Humanities",
      "Communities",
      "Philosophy"
    ],
    required: true
  },
  name: { 
    type: String, 
    required: [true, 'Name is required'],
    trim: true
  },
  pdfUrl: { type: String } // S3 URL for PDF
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ✅ Index for full-text search
ResearchPaperSchema.index({
  title: 'text',
  abstract: 'text',
  'authors.affiliation': 'text',
  keywords: 'text'
});

// ✅ Virtual: citation (optional for future use)
ResearchPaperSchema.virtual('citation').get(function() {
  const affiliations = this.authors.map(a => a.affiliation).join(', ');
  const year = this.publicationDate ? this.publicationDate.getFullYear() : 'n.d.';
  return `${affiliations} (${year}). ${this.title}.`;
});

// ✅ Auto-update lastUpdated field
ResearchPaperSchema.pre('save', function(next) {
  this.lastUpdated = Date.now();
  next();
});

// ✅ Export Model
export default mongoose.model("ResearchPaper", ResearchPaperSchema);
