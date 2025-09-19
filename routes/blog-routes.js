import express from "express";
const router = express.Router();
import blogController from "../controller/blog-controller.js";
import upload from '../middleware/multer.js';
import {adminauthenticate} from '../middleware/adminauth.js'
import { checkRole } from "../middleware/roleCheck.js";
router.post("/createblog",adminauthenticate,  upload.any(),blogController.createBlog); // done

router.get('/getallblog', blogController.getAllBlogs) 
// Get a blog by Id
router.get('/getById/:id', blogController.getBlogById);

// Update a blog by ID
router.put('/updateblog/:id',adminauthenticate, upload.any(), blogController.updateBlog); //done

// Delete a blog by ID
router.delete('/deleteblog/:id',adminauthenticate, blogController.deleteBlog); // done

router.get('/latestblog', blogController.getLatestBlogs);

router.get('/foundation-blogs', blogController.getFoundationBlogs);

router.get('/ic-blogs', blogController.getICBlogs);

router.get('/getById/:id', blogController.getBlogsById);

export default router;