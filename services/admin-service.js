import AdminRepository from "../repository/admin-repository.js";
import jwt from "jsonwebtoken";
import config from "../config/server-config.js";
class AdminService {
    constructor() {
        this.adminRepository = new AdminRepository();
    }

    async createAdmin(adminData) {
        try {
            const existingAdmin = await this.adminRepository.findByEmail(adminData.email);
            if (existingAdmin) {
                throw new Error('Admin with this email already exists');
            }
            const newAdmin = await this.adminRepository.create(adminData);
            // Generate JWT token for the new admin
            const payload = {
                id: newAdmin._id,
                email: newAdmin.email,
                role: newAdmin.role,
            };
            const token = jwt.sign(payload, config.JWT_SECRET_KEY, { 
                expiresIn: config.JWT_EXPIRY_DATE 
            });
            return {token, newAdmin};
        } catch (error) {
            throw new Error(`Error creating admin: ${error.message}`);
        }
    }

    async loginAdmin(email, password) {
        try {
            const admin = await this.adminRepository.findByEmail(email);
            if (!admin) {
                throw new Error('Admin not found');
            }
            const isPasswordValid = await admin.comparePassword(password);
            if (!isPasswordValid) {
                throw new Error('Invalid password');
            }
            // Generate JWT token for the admin
            const payload = {
                id: admin._id,
                email: admin.email,
                role: admin.role,
            };
            const token = jwt.sign(payload, config.JWT_SECRET_KEY, { 
                expiresIn: config.JWT_EXPIRY_DATE 
            });
            return {token, admin};
        } catch (error) {
            throw new Error(`Error logging in admin: ${error.message}`);
        }
    }

    async getAllAdmins() {
        try {
            return await this.adminRepository.getAll();
        } catch (error) {
            throw new Error(`Error fetching all admins: ${error.message}`);
        }
    }

    async getAdminById(id) {
        try {
            const admin =  await this.adminRepository.getById(id);
            if (!admin) {
                throw new Error('Admin not found');
            }
            return admin;
        } catch (error) {
            throw new Error(`Error fetching admin by ID: ${error.message}`);
        }
    }

    async updateAdmin(id, data) {
        try {
            const updatedAdmin = await this.adminRepository.findByIdandUpdate(id, data);
            if (!updatedAdmin) {
                throw new Error('Admin not found');
            }
            return updatedAdmin;
        } catch (error) {
            throw new Error(`Error updating admin: ${error.message}`);
        }
    }

    async deleteAdmin(id) {
        try {
            const deletedAdmin = await this.adminRepository.findByIdandDelete(id);
            if (!deletedAdmin) {
                throw new Error('Admin not found');
            }
            return deletedAdmin;
        } catch (error) {
            throw new Error(`Error deleting admin: ${error.message}`);
        }
    }

}

export default AdminService;