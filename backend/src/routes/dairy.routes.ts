import { Router } from 'express';
import { dairyController } from '../controllers/dairy.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/rbac.middleware';

const router = Router();

router.use(authenticate);

// Lets a supervisor populate a "which dairy" selector before viewing
// that dairy's monthly payment or protsahan register.
router.get('/region', authorize('SUPERVISOR'), dairyController.listForRegion);

export default router;
