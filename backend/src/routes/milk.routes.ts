import { Router } from 'express';
import { milkController } from '../controllers/milk.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/rbac.middleware';
import { validateBody } from '../middleware/validate.middleware';
import { createMilkEntrySchema } from '../validators/milk.validator';

const router = Router();

router.use(authenticate);

router.post('/', authorize('SECRETARY'), validateBody(createMilkEntrySchema), milkController.recordEntry);
router.get('/register', authorize('SECRETARY', 'SUPERVISOR'), milkController.dailyRegister);
router.get('/me', authorize('USER'), milkController.myHistory);

export default router;
