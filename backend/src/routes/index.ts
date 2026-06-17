import { Router } from 'express';
import authRoutes from './auth.routes';
import farmerRoutes from './farmer.routes';
import milkRoutes from './milk.routes';
import dairyRoutes from './dairy.routes';
import monthlyPaymentRoutes from './monthlyPayment.routes';
import protsahanRoutes from './protsahan.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/farmers', farmerRoutes);
router.use('/milk', milkRoutes);
router.use('/dairies', dairyRoutes);
router.use('/monthly-payments', monthlyPaymentRoutes);
router.use('/protsahan', protsahanRoutes);

export default router;
