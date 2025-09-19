import CareerService from "../services/career-service.js";
const careerService = new CareerService();

const createCareer = async (req, res) => {
    try {
        const data = req.body;
        const newCareer = await careerService.createCareer(data);
        res.status(201).json({
            success: true,
            message: "Career created successfully",
            data: newCareer
        });
    } catch (error) {
        console.error("Error creating career:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}

// Get all careers
const getAllCareers = async (req, res) => {
    try {
        const careers = await careerService.getAllCareers();
        res.status(200).json({
            success: true,
            data: careers
        });
    } catch (error) {
        console.error("Error fetching careers:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}

// get by id
const getCareerById = async (req, res) => {
    try {
        const { id } = req.params;
        const career = await careerService.getCareerById(id);
        if (!career) {
            return res.status(404).json({
                success: false,
                message: "Career not found"
            });
        }
        res.status(200).json({
            success: true,
            data: career
        });
    } catch (error) {
        console.error("Error fetching career by ID:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}

// Update career
const updateCareer = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const updatedCareer = await careerService.updateCareer(id, data);
        if (!updatedCareer) {
            return res.status(404).json({
                success: false,
                message: "Career not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Career updated successfully",
            data: updatedCareer
        });
    } catch (error) {
        console.error("Error updating career:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}

// Delete career
const deleteCareer = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCareer = await careerService.deleteCareer(id);
        if (!deletedCareer) {
            return res.status(404).json({
                success: false,
                message: "Career not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Career deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting career:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}

export default {
    createCareer,
    getAllCareers,
    getCareerById,
    updateCareer,
    deleteCareer
};