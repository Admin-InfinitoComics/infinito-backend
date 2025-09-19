import CareerRepository from "../repository/career-repository.js";

class CareerService {
    constructor() {
        this.careerRepository = new CareerRepository();
    }

    async createCareer(data) {
        try {
            const newcareer =  await this.careerRepository.create(data);
            return newcareer;
        } catch (error) {
            console.error("Error creating career:", error);
            throw error;
        }
    }

    async getAllCareers() {
        try {
            const careers = await this.careerRepository.getAll();
            return careers;
        } catch (error) {
            console.error("Error fetching careers:", error);
            throw error;
        }
    }

    async getCareerById(id) {
        try {
            const career = await this.careerRepository.getById(id);
            return career;
        } catch (error) {
            console.error("Error fetching career by ID:", error);
            throw error;
        }
    }

    async updateCareer(id, data) {
        try {
            const updatedCareer = await this.careerRepository.findByIdandUpdate(id, data);
            return updatedCareer;
        } catch (error) {
            console.error("Error updating career:", error);
            throw error;
        }
    }

    async deleteCareer(id) {
        try {
            const deletedCareer = await this.careerRepository.findByIdandDelete(id);
            return deletedCareer;
        } catch (error) {
            console.error("Error deleting career:", error);
            throw error;
        }
    }
}

export default CareerService;