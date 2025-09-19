import CrudRepository from "./crud-repository.js"
import Comic from "../models/Comics.js"

class ComicRepository extends CrudRepository {
    constructor(){
        super(Comic);
    }

    async getAllWithChapters() {
        try {
            return await Comic.find().populate("chapters").exec();
        } catch (error) {
            console.error("Error fetching comics with chapters:", error);
            throw error;
        }
    }
}

export default ComicRepository;