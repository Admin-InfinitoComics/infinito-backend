import mongoose from 'mongoose';
import ResearchPaperService from '../services/research-paper-service.js'

const researchPaperService = new ResearchPaperService();

const createPaper = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized',
                data: {},
                err: 'Missing user ID'
            });
        }

        const data = {
            ...req.body,
            createdBy: req.user._id
        };
        const paper = await researchPaperService.createPaper(data);
        return res.status(201).json({
            success: true,
            message: 'Research paper created successfully',
            data: paper,
            err: {}
        });
    } catch (error) {

        return res.status(500).json({
            success: false,
            message: 'Error creating research paper',
            data: {},
            err: error.message
        });
    }
};

const updatePaper = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized',
                data: {},
                err: 'Missing user ID'
            });
        }

        const paper = await researchPaperService.updatePaper(
            req.params.id, 
            req.body,
            req.user._id.toString()
        );
        return res.status(200).json({
            success: true,
            message: 'Research paper updated successfully',
            data: paper,
            err: {}
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error updating research paper',
            data: {},
            err: error.message
        });
    }
};

const deletePaper = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized',
                data: {},
                err: 'Missing user ID'
            });
        }

        await researchPaperService.deletePaper(req.params.id, req.user._id.toString());
        return res.status(200).json({
            success: true,
            message: 'Research paper deleted successfully',
            data: {},
            err: {}
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error deleting research paper',
            data: {},
            err: error.message
        });
    }
};

const getPaper = async (req, res) => {
    try {
        const paper = await researchPaperService.getPaper(
            req.params.id,
            true // Increment view count
        );
        return res.status(200).json({
            success: true,
            message: 'Research paper retrieved successfully',
            data: paper,
            err: {}
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error retrieving research paper',
            data: {},
            err: error.message
        });
    }
};

const getAllPapers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const filters = {};

        if (req.query.authorId && mongoose.Types.ObjectId.isValid(req.query.authorId)) {
            filters.authors = {
                $elemMatch: {
                    _id: new mongoose.Types.ObjectId(req.query.authorId)
                }
            };
        }

        if (req.query.isPublished !== undefined) {
            filters.isPublished = req.query.isPublished === 'true';
        }

        const papers = await researchPaperService.getAllPapers(page, limit, filters);
        return res.status(200).json({
            success: true,
            message: 'Research papers retrieved successfully',
            data: papers,
            err: {}
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error retrieving research papers',
            data: {},
            err: error.message
        });
    }
};

const searchPapers = async (req, res) => {
    try {
        const { query } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const papers = await researchPaperService.searchPapers(query, page, limit);
        return res.status(200).json({
            success: true,
            message: 'Research papers retrieved successfully',
            data: papers,
            err: {}
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error searching research papers',
            data: {},
            err: error.message
        });
    }
};

export {
    createPaper,
    updatePaper,
    deletePaper,
    getPaper,
    getAllPapers,
    searchPapers
};
