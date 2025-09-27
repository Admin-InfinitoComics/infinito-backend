import mongoose from "mongoose";

const PaperAccessSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  paperId: { type: mongoose.Schema.Types.ObjectId, ref: "ResearchPaper", required: true },
  expiresAt: { type: Date, required: true }
}, {
  timestamps: true
});

export default mongoose.model("PaperAccess", PaperAccessSchema);
