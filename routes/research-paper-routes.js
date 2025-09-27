import express from 'express';
import multer from "multer";

import { 
    createPaper, 
    updatePaper, 
    deletePaper, 
    getPaper, 
    getAllPapers, 
    searchPapers,
    getSignedPdfUrl
} from '../controller/research-paper-controller.js';
import { adminauthenticate } from '../middleware/adminauth.js';

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // temp local storage, will upload to S3 in controller

// Admin-only routes
router.post('/', adminauthenticate, upload.single("pdf"), createPaper);
router.put('/:id', adminauthenticate, updatePaper);
router.delete('/:id', adminauthenticate, deletePaper);

// Public routes
router.get('/', getAllPapers);
router.get('/search', searchPapers);
router.get('/:id', getPaper);
router.get('/:id/pdf', getSignedPdfUrl); // signed PDF download route

export default router;
