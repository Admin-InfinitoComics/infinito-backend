import ResearchPaperRepository from "../repository/research-paper-repository.js";
import mongoose from "mongoose";

class ResearchPaperService {
  constructor() {
    this.researchPaperRepository = new ResearchPaperRepository();
  }

  async createPaper(data) {
    try {
      // Required fields
      const requiredFields = [
        // "name", // REMOVE this line, name is no longer required
        "title","abstract","keywords","introduction",
        "objective","literature",
        "methodology","experimentalResults",
        "discussion","conclusion",
        "publicationDate","category",
        "authors"
      ];
      for (const field of requiredFields) {
        if (!data[field] || (typeof data[field] === "string" && data[field].trim() === "")) {
          throw new Error(`${field} is required`);
        }
      }

      // Convert keywords string to array if needed
      if (typeof data.keywords === "string") {
        data.keywords = data.keywords.split(",").map(k => k.trim()).filter(k => k);
      }

      // Convert references string to array of objects
      if (typeof data.references === "string") {
        data.references = data.references
          .split("\n")
          .map(ref => ref.trim())
          .filter(ref => ref)
          .map(ref => ({ text: ref }));
      }

      // Validate authors
      if (!Array.isArray(data.authors) || data.authors.length === 0) {
        throw new Error("At least one author is required");
      }
      data.authors.forEach((author, i) => {
        if (!author.affiliation || author.affiliation.trim() === "") {
          throw new Error(`Affiliation is required for author at index ${i}`);
        }
      });

      const paper = await this.researchPaperRepository.createPaper({
        ...data,
        isPublished: data.isPublished || false,
        createdBy: new mongoose.Types.ObjectId(data.createdBy)
      });

      return paper;
    } catch (error) {
      console.log("Service Error (createPaper):", error.message);
      throw error;
    }
  }

  async updatePaper(paperId, data, userId) {
    try {
      const existingPaper = await this.researchPaperRepository.findById(paperId);
      if (!existingPaper) throw new Error("Paper not found");
      if (existingPaper.createdBy.toString() !== userId) throw new Error("Not authorized");

      const { _id, createdBy, createdAt, ...updateData } = data;

      // Convert keywords & references
      if (updateData.keywords && typeof updateData.keywords === "string") {
        updateData.keywords = updateData.keywords.split(",").map(k => k.trim()).filter(k => k);
      }
      if (updateData.references && typeof updateData.references === "string") {
        updateData.references = updateData.references.split("\n").map(r => r.trim()).filter(r => r).map(r => ({ text: r }));
      }

      // Validate authors
      if (updateData.authors) {
        if (!Array.isArray(updateData.authors) || updateData.authors.length === 0) {
          throw new Error("At least one author is required");
        }
        updateData.authors.forEach((author, i) => {
          if (!author.affiliation || author.affiliation.trim() === "") {
            throw new Error(`Affiliation is required for author at index ${i}`);
          }
        });
      }

      // Validate name and category if present
      if ('name' in updateData && (!updateData.name || updateData.name.trim() === "")) {
        throw new Error("Name is required");
      }
      if ('category' in updateData && (!updateData.category || updateData.category.trim() === "")) {
        throw new Error("Category is required");
      }

      return await this.researchPaperRepository.update(paperId, updateData);
    } catch (error) {
      console.log("Service Error (updatePaper):", error.message);
      throw error;
    }
  }

  async deletePaper(paperId, userId) {
    try {
      const existingPaper = await this.researchPaperRepository.findById(paperId);
      if (!existingPaper) throw new Error("Paper not found");
      if (existingPaper.createdBy.toString() !== userId) throw new Error("Not authorized");

      return await this.researchPaperRepository.destroy(paperId);
    } catch (error) {
      console.log("Service Error (deletePaper):", error.message);
      throw error;
    }
  }

  async getPaper(paperId, incrementView = false) {
    try {
      if (incrementView) return await this.researchPaperRepository.incrementViews(paperId);
      return await this.researchPaperRepository.findById(paperId);
    } catch (error) {
      console.log("Service Error (getPaper):", error.message);
      throw error;
    }
  }

  async getAllPapers(page = 1, limit = 10, filters = {}) {
  const skip = (page - 1) * limit;
  const papers = await this.researchPaperRepository.model
    .find(filters)
    .sort({ publicationDate: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await this.researchPaperRepository.model.countDocuments(filters);

  return { papers, total };
}

  async searchPapers(query, page = 1, limit = 10) {
    try {
      if (!query || query.trim() === "") return await this.getAllPapers(page, limit);
      return await this.researchPaperRepository.searchPapers(query, page, limit);
    } catch (error) {
      console.log("Service Error (searchPapers):", error.message);
      throw error;
    }
  }

  async incrementDownloads(paperId) {
    try {
      return await this.researchPaperRepository.incrementDownloads(paperId);
    } catch (error) {
      console.log("Service Error (incrementDownloads):", error.message);
      throw error;
    }
  }
}

export default ResearchPaperService;