import { Router } from 'express';
import { farmerController } from '../controllers/farmer.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/rbac.middleware';
import { validateBody } from '../middleware/validate.middleware';
import { createFarmerSchema, updateFarmerSchema } from '../validators/farmer.validator';

const router = Router();

router.use(authenticate);

// Farmer viewing their own profile.
router.get('/me', authorize('USER'), farmerController.myProfile);

// Secretary manages farmers within their own dairy.
router.post('/', authorize('SECRETARY'), validateBody(createFarmerSchema), farmerController.register);
router.patch('/:id', authorize('SECRETARY'), validateBody(updateFarmerSchema), farmerController.update);
router.get('/dairy', authorize('SECRETARY'), farmerController.listMine);

// Supervisor views all farmers across dairies in their region.
router.get('/region', authorize('SUPERVISOR'), farmerController.listForRegion);

// Any authenticated staff can fetch a single farmer by id (e.g. to show
// context on a register row); narrower scoping happens at the list level.
router.get('/:id', authorize('SECRETARY', 'SUPERVISOR'), farmerController.getById);

export default router;
