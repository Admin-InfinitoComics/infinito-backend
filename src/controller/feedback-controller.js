import FeedbackService from "../services/feedback-service.js";

export const submitFeedback = async (req, res) => {
  try {
    const { subject, feedback } = req.body;
    const { name, email, _id: userId } = req.user;

    if (!subject || !feedback) {
      return res.status(400).json({ 
        success: false, 
        message: "Subject and feedback are required" });
    }

    const response = await FeedbackService.submitFeedback({
      userId,
      name,
      email,
      subject,
      feedback
    });

    res.status(201).json({ 
        success: true, 
        message: "Feedback submitted", response });
  } catch (error) {
    res.status(500).json({ 
        success: false, 
        message: "Error submitting feedback", 
        error: error.message });
  }
};

export const getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await FeedbackService.getAllFeedbacks();
    res.status(200).json({ 
        success: true, 
        message: "All feedbacks retrieved", 
        feedbacks });
  } catch (error) {
    res.status(500).json({ 
        success: false, 
        message: "Error retrieving feedbacks", 
        error: error.message });
  }
};
