import CrudRepository from "./crud-repository.js";
import Admin from "../models/Admin.js";
class AdminRepository extends CrudRepository {
    constructor() {
        super(Admin);
    }
    async findByEmail(email) {
        try {
            const admin = await this.model.findOne({ email: email });
            return admin;       
        }
        catch (error) {
            throw new Error(`Error finding admin by email: ${error.message}`);
        }
    }
}

export default AdminRepository;