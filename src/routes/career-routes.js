import express from 'express';
const router = express.Router();
import CareerController from '../controller/career-controller.js';

router.post('/create', CareerController.createCareer);

router.get('/getall', CareerController.getAllCareers);

router.get('/getById/:id', CareerController.getCareerById);

router.put('/update/:id', CareerController.updateCareer);

router.delete('/delete/:id', CareerController.deleteCareer);

export default router;