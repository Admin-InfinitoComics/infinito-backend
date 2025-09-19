import express from "express";
import upload from "../middleware/multer.js";

import {
    createAboutEvent,
    getAllAboutEvents,
    updateAboutEvent,
    deleteAboutEvent
} from '../controller/aboutTimeline-controller.js'

import { adminauthenticate } from "../middleware/adminauth.js";

const router = express.Router();

router.get("/getAllAbout",  getAllAboutEvents);
router.post("/createAbout", adminauthenticate, upload.any(), createAboutEvent);
router.put("/updateAbout/:id", adminauthenticate,  upload.any(), updateAboutEvent);
router.delete("/deleteAbout/:id", adminauthenticate, deleteAboutEvent);

export default router;