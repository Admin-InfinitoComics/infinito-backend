import ResearchPaper from "../models/ResearchPaper.js";
import CrudRepository from "./crud-repository.js";

class ResearchPaperRepository extends CrudRepository {
  constructor() {
    super(ResearchPaper);
  }

  async createPaper(data) {
    try {
      const paper = await ResearchPaper.create(data);
      return paper;
    } catch (error) {
      console.log("Repository Error (createPaper):", error.message);
      throw error;
    }
  }

  async findById(id) {
    try {
      const paper = await ResearchPaper.findById(id).lean();
      return paper;
    } catch (error) {
      console.log("Repository Error (findById):", error.message);
      throw error;
    }
  }

  async update(id, updateData) {
    try {
      const paper = await ResearchPaper.findByIdAndUpdate(id, updateData, { new: true }).lean();
      return paper;
    } catch (error) {
      console.log("Repository Error (update):", error.message);
      throw error;
    }
  }

  async destroy(id) {
    try {
      const result = await ResearchPaper.findByIdAndDelete(id).lean();
      return result;
    } catch (error) {
      console.log("Repository Error (destroy):", error.message);
      throw error;
    }
  }

  async getAll(page = 1, limit = 10, filters = {}, sort = { publicationDate: -1 }) {
    try {
      const skip = (page - 1) * limit;
      const papers = await ResearchPaper.find(filters)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean();

      const total = await ResearchPaper.countDocuments(filters);
      return { papers, total };
    } catch (error) {
      console.log("Repository Error (getAll):", error.message);
      throw error;
    }
  }

  async searchPapers(query, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const filter = { $text: { $search: query }, isPublished: true };

      const papers = await ResearchPaper.find(filter, { score: { $meta: "textScore" } })
        .sort({ score: { $meta: "textScore" } })
        .skip(skip)
        .limit(limit)
        .lean();

      const total = await ResearchPaper.countDocuments(filter);
      return { papers, total };
    } catch (error) {
      console.log("Repository Error (searchPapers):", error.message);
      throw error;
    }
  }

  async incrementViews(paperId) {
    try {
      const paper = await ResearchPaper.findByIdAndUpdate(
        paperId,
        { $inc: { views: 1 } },
        { new: true }
      ).lean();
      return paper;
    } catch (error) {
      console.log("Repository Error (incrementViews):", error.message);
      throw error;
    }
  }

  async incrementDownloads(paperId) {
    try {
      const paper = await ResearchPaper.findByIdAndUpdate(
        paperId,
        { $inc: { downloads: 1 } },
        { new: true }
      ).lean();
      return paper;
    } catch (error) {
      console.log("Repository Error (incrementDownloads):", error.message);
      throw error;
    }
  }
}

export default ResearchPaperRepository;
