import mongoose from "mongoose";

// ✅ Author Subdocument Schema
const AuthorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  affiliation: { type: String },
  orcid: { type: String }
}, { _id: false }); // Avoid nested _id for subdocs

// ✅ Reference Subdocument Schema
const ReferenceSchema = new mongoose.Schema({
  text: { type: String, required: true },
  doi: { type: String }
}, { _id: false }); // Optional: avoids nested _id

// ✅ Utility: Validate at least one author
function arrayLimit(val) {
  return Array.isArray(val) && val.length > 0;
}

// ✅ Main Schema
const ResearchPaperSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Title is required'],
    trim: true
  },
  authors: {
    type: [AuthorSchema],
    required: true, 
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
  relatedWork: {
    type: String,
    required: [true, 'Related work section is required']
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
  acknowledgments: {
    type: String
  },
  references: [ReferenceSchema],
  doi: { 
    type: String,
    trim: true
  },
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
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ✅ Index for full-text search
ResearchPaperSchema.index({
  title: 'text',
  abstract: 'text',
  'authors.name': 'text',
  keywords: 'text'
});

// ✅ Citation virtual property
ResearchPaperSchema.virtual('citation').get(function() {
  const authors = this.authors.map(a => a.name).join(', ');
  const year = this.publicationDate ? this.publicationDate.getFullYear() : 'n.d.';
  return `${authors} (${year}). ${this.title}.`;
});

// ✅ Auto-update lastUpdated field
ResearchPaperSchema.pre('save', function(next) {
  this.lastUpdated = Date.now();
  next();
});

// ✅ Export Model
export default mongoose.model("ResearchPaper", ResearchPaperSchema);
