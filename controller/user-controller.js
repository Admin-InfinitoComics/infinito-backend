import UserService from "../services/user-service.js";

const userservice = new UserService();

const getAll = async (req, res) => {
  try {
    const users = await userservice.getAll();
    res.status(200).json({ users, success: true });
  } catch (error) {
    throw error;
  }
};

const signup = async (req, res) => {
  try {
    const user = await userservice.signup(req.body);
    res.status(200).json({ data: user, success: true });
  } catch (error) {
    res.status(400).json({ message: error.message, success: false });
  }
};

const login = async (req, res) => {
  try {
    const { token, user } = await userservice.login(req.body);

    // Set token in cookie with domain configuration for cross-subdomain access
    res.cookie("token", token, {
      httpOnly: true,             // Not accessible from JS
      secure: process.env.NODE_ENV === 'production',  // HTTPS only in production
      sameSite: "lax",           // Required for cross-domain/subdomain
      domain: ".infinitocomics.com", // All subdomains of infinitocomics.com
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: { id: user._id, email: user.email, name: user.name },
    });
  } catch (error) {
    res.status(401).json({ message: error.message, success: false });
  }
};

const logout = async (req, res) => {
  try {
    await userservice.logout(req.user);
    
    // Clear the token cookie
    res.cookie("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: "lax",
      domain: ".infinitocomics.com",
      path: "/",
      maxAge: 0, // Expire immediately
    });
    
    res.status(200).json({ message: "Logout successful", success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

const getById = async (req, res) => {
  try {
    const user = await userservice.getById(req.query.id);
    res.status(200).json({ data: user, success: true });
  } catch (error) {
    res.status(404).json({ message: error.message, success: false });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await userservice.updateUser(req.query.id, req.body);
    res.status(200).json({ data: user, success: true });
  } catch (error) {
    res.status(400).json({ message: error.message, success: false });
  }
};

const deleteUser = async (req, res) => {
  try {
    await userservice.deleteUser(req.query.id);
    res.status(200).json({ message: "User deleted", success: true });
  } catch (error) {
    res.status(400).json({ message: error.message, success: false });
  }
};

const changePassword = async (req, res) => {
  try {
    await userservice.changePassword(req.query.id, req.body);
    res.status(200).json({ message: "Password updated", success: true });
  } catch (error) {
    res.status(400).json({ message: error.message, success: false });
  }
};

// ✅ OTP-based forgot password
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    await userservice.forgotPassword(email);
    res.status(200).json({ message: "OTP sent to email", success: true });
  } catch (error) {
    res.status(400).json({ message: error.message, success: false });
  }
};

// ✅ OTP verify
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    await userservice.verifyOtp(email, otp);
    res.status(200).json({ message: "OTP verified", success: true });
  } catch (error) {
    res.status(400).json({ message: error.message, success: false });
  }
};

// ✅ Reset password using verified OTP
const resetPassword = async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;
  try {
    await userservice.resetPasswordOtp(email, newPassword, confirmPassword);
    res.status(200).json({ message: "Password has been reset successfully", success: true });
  } catch (error) {
    res.status(400).json({ message: error.message, success: false });
  }
};

const uploadimage = async (req, res) => {
  try {
    const imageurl = await userservice.upload(req.file);
    return res.status(200).json({
      message: "Image uploaded successfully",
      success: true,
      data: imageurl,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
      success: false,
    })
  }
}

const verifyemail = async(req, res) => {
    try {
        const response = await userservice.verify(req.body);
        if(!response){
            return res.status(401).json({
                success: false,
                message: "Email verification failed",
            })
        }
        return res.status(201).json({
            success: true,
            message: "Email verified successfully",
        })
    } catch (error) {
        return res.status(401).json({
            message: "Error verifying email",
            success: false,
            err: error
        })
    }
}

const forgetPasswordFunc = async(req, res) => {
    try {
        const {email} = req.body;
        if(email) {
            const user = await userservice.forgetPassword(email);
            return res.status(200).json({
                data: user,
                success: true
            })
        }
        else{
            return res.status(400).json({
                message: "email is required"
            })
        }
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        })
    }
}

const forgetPasswordEmail = async (req, res) =>  {
  try {
    const userId = req.userFromToken.id; 
    const newPassword = req.body.newPassword;
    const result = await userservice.resetPassword(userId, newPassword);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// Check if user is authenticated
const checkAuth = async (req, res) => {
  try {
    // If this point is reached, the user is authenticated (auth middleware has run)
    if (req.user) {
      return res.status(200).json({
        success: true,
        message: "User is authenticated",
        data: { id: req.user._id, email: req.user.email, name: req.user.name }
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "User is not authenticated"
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const Usercontroller = {
  signup,
  login,
  logout,
  getAll,
  getById,
  updateUser,
  deleteUser,
  changePassword,
  forgotPassword,
  verifyOtp,
  resetPassword,
  uploadimage,
  verifyemail,
  forgetPasswordFunc,
  forgetPasswordEmail,
  checkAuth
};

export default Usercontroller;
