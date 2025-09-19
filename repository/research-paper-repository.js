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
            console.log("Something went wrong in repository layer");
            throw error;
        }
    }

    async findById(id) {
        try {
            const paper = await ResearchPaper.findById(id);
            return paper;
        } catch (error) {
            console.log("Something went wrong in repository layer (findById)");
            throw error;
        }
    }

    async destroy(id) {
        try {
            const result = await ResearchPaper.findByIdAndDelete(id);
            return result;
        } catch (error) {
            console.log("Something went wrong in repository layer (destroy)");
            throw error;
        }
    }

    async getPublishedPapers(page = 1, limit = 10) {
        try {
            const skip = (page - 1) * limit;
            const papers = await ResearchPaper.find({ isPublished: true })
                .sort({ publicationDate: -1 })
                .skip(skip)
                .limit(limit);
            return papers;
        } catch (error) {
            console.log("Something went wrong in repository layer");
            throw error;
        }
    }

    async getPaperByDoi(doi) {
        try {
            const paper = await ResearchPaper.findOne({ doi });
            return paper;
        } catch (error) {
            console.log("Something went wrong in repository layer");
            throw error;
        }
    }

    async searchPapers(query, page = 1, limit = 10) {
        try {
            const skip = (page - 1) * limit;
            const papers = await ResearchPaper.find(
                { $text: { $search: query }, isPublished: true },
                { score: { $meta: "textScore" } }
            )
                .sort({ score: { $meta: "textScore" } })
                .skip(skip)
                .limit(limit);
            return papers;
        } catch (error) {
            console.log("Something went wrong in repository layer");
            throw error;
        }
    }

    async getPapersByAuthor(authorId, page = 1, limit = 10) {
        try {
            const skip = (page - 1) * limit;
            const papers = await ResearchPaper.find({ 'authors._id': authorId, isPublished: true })
                .sort({ publicationDate: -1 })
                .skip(skip)
                .limit(limit);
            return papers;
        } catch (error) {
            console.log("Something went wrong in repository layer");
            throw error;
        }
    }

    async incrementViews(paperId) {
        try {
            const paper = await ResearchPaper.findByIdAndUpdate(
                paperId,
                { $inc: { views: 1 } },
                { new: true }
            );
            return paper;
        } catch (error) {
            console.log("Something went wrong in repository layer");
            throw error;
        }
    }

    async incrementDownloads(paperId) {
        try {
            const paper = await ResearchPaper.findByIdAndUpdate(
                paperId,
                { $inc: { downloads: 1 } },
                { new: true }
            );
            return paper;
        } catch (error) {
            console.log("Something went wrong in repository layer");
            throw error;
        }
    }
}

export default ResearchPaperRepository;
