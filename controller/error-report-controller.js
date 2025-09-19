import ErrorReportService from "../services/error-report-service.js";

export const submitErrorReport = async (req, res) => {
  try {
    const { subject, message } = req.body;

    if (!subject || !message) {
      return res.status(400).json({ success: false, message: "Subject and message are required" });
    }

    const report = await ErrorReportService.submitReport({
      userId: req.user._id,
      subject,
      message
    });

    res.status(201).json({ success: true, message: "Report submitted", report });
  } catch (error) {
    console.error("Submit report failed:", error);
    res.status(500).json({ 
        success: false, 
        message: error.message, 
        error: error.message });
  }
};
export const getAllErrorReports = async (req, res) => {
  try {
    const reports = await ErrorReportService.getAllReports();
    res.status(200).json({ success: true, reports });
  } catch (error) {
    console.error("Get all reports failed:", error);
    res.status(500).json({ 
        success: false,
        message: error.message,
        error: error.message });
  }
};
