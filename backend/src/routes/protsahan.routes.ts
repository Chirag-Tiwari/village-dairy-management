import { Router } from 'express';
import { protsahanController } from '../controllers/protsahan.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/rbac.middleware';
import { validateQuery, validateBody } from '../middleware/validate.middleware';
import { protsahanRegisterQuerySchema, protsahanActionSchema } from '../validators/protsahan.validator';

const router = Router();

router.use(authenticate);

router.get(
  '/register',
  authorize('SECRETARY', 'SUPERVISOR'),
  validateQuery(protsahanRegisterQuerySchema),
  protsahanController.getRegister,
);
router.post('/approve', authorize('SUPERVISOR'), validateBody(protsahanActionSchema), protsahanController.approve);
router.post('/mark-paid', authorize('SUPERVISOR'), validateBody(protsahanActionSchema), protsahanController.markPaid);
router.get('/me', authorize('USER'), protsahanController.myLedger);

export default router;
