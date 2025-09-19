import express from 'express';
import {createOrder, webhooksetup, verifyPayment} from '../controller/payment-controller.js'
import { authenticate } from '../middleware/auth.js';

const paymentRoutes = express.Router();

paymentRoutes.post('/create',authenticate, createOrder);
paymentRoutes.get('/webhook', webhooksetup);
paymentRoutes.get('/verify', authenticate, verifyPayment)

export default paymentRoutes;
