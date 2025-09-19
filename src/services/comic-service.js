import ComicRepository from "../repository/comic-repository.js";


class ComicService {
    constructor (){
        this.ComicRepository = new ComicRepository();
    }
    
    async createComic(data) {
        try {
            const newcomic =  await this.ComicRepository.create(data);
            return newcomic;
        } catch (error) {
            console.error("Error creating comic:", error);
            throw error;
        }
    }

    async getAllComics() {
        try {
            const comics = await this.ComicRepository.getAllWithChapters();
            return comics;
        } catch (error) {
            console.error("Error fetching comics:", error);
            throw error;
        }
    }

    async getComicById(id) {
        try {
            const comic = await this.ComicRepository.getById(id);
            return comic;
        } catch (error) {
            console.error("Error fetching comic by ID:", error);
            throw error;
        }
    }

    async updateComic(id, data) {
        try {
            const updatedcomic = await this.ComicRepository.findByIdandUpdate(id, data);
            return updatedcomic;
        } catch (error) {
            console.error("Error updating comic:", error);
            throw error;
        }
    }

    async deleteComic(id) {
        try {
            const deletedComic = await this.ComicRepository.findByIdandDelete(id);
            return deletedComic;
        } catch (error) {
            console.error("Error deleting comic:", error);
            throw error;
        }
    }
}

export default ComicService;