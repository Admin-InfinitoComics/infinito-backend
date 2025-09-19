import Blog from "../models/Blog.js";
import CrudRepository from "./crud-repository.js";

class BlogRepository extends CrudRepository {
    constructor(){
        super(Blog)
    }

    async getLatest(limit = 5) {
        try {
            return await Blog.find({}).sort({ createdAt: -1 }).limit(limit);
        } catch (error) {
            throw error;
        }
    }

    async getByCategory(category, limit) {
    return await this.model.find({ category })
        .sort({ createdAt: 1 })
        .limit(limit);
    }

    async getBlogsByCategory(category, limit) {
    return await Blog.find({ category })
        .sort({ createdAt: 1 }) 
        .limit(limit);
    }

    async getBlogById(id) {
        return await Blog.findById(id);
    }
}

export default BlogRepository