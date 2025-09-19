import FeedbackRepository from "../repository/feedback-repository.js";

class FeedbackService {
  async submitFeedback({ userId, name, email, subject, feedback }) {
    return await FeedbackRepository.create({ 
      user: userId, 
      name, 
      email, 
      subject, 
      feedback 
    });
  }

  async getAllFeedbacks() {
    return await FeedbackRepository.getAll();
  }
}

export default new FeedbackService();
