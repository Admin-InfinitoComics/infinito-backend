// src/models/ErrorReport.js
import mongoose from "mongoose";

const errorReportSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account", // make sure this matches your exported model name
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  }
}, { timestamps: true });

const ErrorReport = mongoose.model("ErrorReport", errorReportSchema);
export default ErrorReport;
