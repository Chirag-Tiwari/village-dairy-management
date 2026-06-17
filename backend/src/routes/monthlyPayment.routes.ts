import { Router } from 'express';
import { monthlyPaymentController } from '../controllers/monthlyPayment.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/rbac.middleware';
import { validateQuery, validateBody } from '../middleware/validate.middleware';
import { monthlyRegisterQuerySchema, monthlyActionSchema } from '../validators/monthlyPayment.validator';

const router = Router();

router.use(authenticate);

// Secretary: view only. Supervisor: view, verify, and approve.
router.get(
  '/register',
  authorize('SECRETARY', 'SUPERVISOR'),
  validateQuery(monthlyRegisterQuerySchema),
  monthlyPaymentController.getRegister,
);
router.post('/verify', authorize('SUPERVISOR'), validateBody(monthlyActionSchema), monthlyPaymentController.verify);
router.post('/approve', authorize('SUPERVISOR'), validateBody(monthlyActionSchema), monthlyPaymentController.approve);

export default router;
