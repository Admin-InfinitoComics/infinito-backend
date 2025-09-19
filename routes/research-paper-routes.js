import express from 'express';
import { 
    createPaper, 
    updatePaper, 
    deletePaper, 
    getPaper, 
    getAllPapers, 
    searchPapers 
} from '../controller/research-paper-controller.js';
import { adminauthenticate } from '../middleware/adminauth.js';

const router = express.Router();

// Admin-only routes
router.post('/', adminauthenticate, createPaper);
router.put('/:id', adminauthenticate, updatePaper);
router.delete('/:id', adminauthenticate, deletePaper);

// Public routes
router.get('/', getAllPapers);
router.get('/search', searchPapers);
router.get('/:id', getPaper);

export default router;
