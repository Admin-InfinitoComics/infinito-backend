import express from "express";
import upload from "../middleware/multer.js";

import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent
} from "../controller/timeline-controller.js";

import { adminauthenticate } from "../middleware/adminauth.js";

const router = express.Router();

// Public endpoints
router.get("/getAll",  getAllEvents);
router.get("/:id",  getEventById);

// Only admins can use these endpoints

// Create Events 
router.post("/create", adminauthenticate, upload.single("image"), createEvent);

// Update Events
router.put("/update/:id", adminauthenticate,  upload.single("image"), updateEvent);

// Delete Events
router.delete("/delete/:id", adminauthenticate, deleteEvent);

export default router;