import ResearchPaperService from "../services/researchPaper-service.js";
const researchPaperService = new ResearchPaperService();

const createResearchPaper = async (req, res) => {
  try {
    const saved = await researchPaperService.create(req.body);
    return res.status(201).json({
      success: true,
      message: "Research paper created",
      data: saved,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getAllResearchPapers = async (req, res) => {
  try {
    const all = await researchPaperService.getAll();
    return res.status(200).json({
      success: true,
      message: "All research papers fetched",
      data: all,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getResearchPaperById = async (req, res) => {
  try {
    const paper = await researchPaperService.getById(req.params.id);
    if (!paper) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    return res.status(200).json({ success: true, data: paper });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateResearchPaper = async (req, res) => {
  try {
    const updated = await researchPaperService.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteResearchPaper = async (req, res) => {
  try {
    await researchPaperService.delete(req.params.id);
    return res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export default {
  createResearchPaper,
  getAllResearchPapers,
  getResearchPaperById,
  updateResearchPaper,
  deleteResearchPaper,
};
