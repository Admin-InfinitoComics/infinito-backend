import ErrorReportRepository from "../repository/error-report-repository.js";

class ErrorReportService {
  async submitReport({ userId, subject, message }) {
    return await ErrorReportRepository.create({ user: userId, subject, message });
  }

  async getAllReports() {
    return await ErrorReportRepository.getAll();
  }
}

export default new ErrorReportService();
