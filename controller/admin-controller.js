import AdminService from "../services/admin-service.js";
const adminService = new AdminService();
// Create a new admin
const createAdmin = async (req, res) => {
    try {
        const { email, password, role, name } = req.body;

        const adminData = await adminService.createAdmin({
            email,
            password,
            role,
            name
        });

        return res.status(201).json({
            success: true,
            message: "Successfully created admin",
            data: adminData,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// Login an admin
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const { token, admin } = await adminService.loginAdmin(email, password);

        // Set token in cookie with domain configuration for cross-subdomain access
        res.cookie("token", token, {
            httpOnly: true,             // Not accessible from JS
            secure: process.env.NODE_ENV === 'production',  // HTTPS only in production
            sameSite: "lax",           // Required for cross-domain/subdomain
            domain: ".infinitocomics.com", // All subdomains of infinitocomics.com
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        return res.status(200).json({
            success: true,
            message: "Successfully logged in",
            data: { id: admin._id, email: admin.email, name: admin.name, role: admin.role },
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const getAllAdmins = async (req, res) => {
    try {
        const allAdmins = await adminService.getAllAdmins();
        return res.status(200).json({
            success: true,
            message: "Successfully fetched all admins",
            data: allAdmins,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getAdminById = async (req, res) => {
    try {
        const admin = await adminService.getAdminById(req.params.id);
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Admin found",
            data: admin,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const updateAdmin = async (req, res) => {
    try {
        const updatedAdmin = await adminService.updateAdmin(req.params.id, req.body);
        if (!updatedAdmin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Admin updated successfully",
            data: updatedAdmin,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const deleteAdmin = async (req, res) => {
    try {
        const deletedAdmin = await adminService.deleteAdmin(req.params.id);
        if (!deletedAdmin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Admin deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Logout an admin
const logoutAdmin = async (req, res) => {
    try {
        // Clear the token cookie
        res.cookie("token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "lax",
            domain: ".infinitocomics.com",
            path: "/",
            maxAge: 0, // Expire immediately
        });
        
        return res.status(200).json({
            success: true,
            message: "Successfully logged out",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export default {
    createAdmin,
    loginAdmin,
    logoutAdmin,
    getAllAdmins,
    getAdminById,
    updateAdmin,
    deleteAdmin
}