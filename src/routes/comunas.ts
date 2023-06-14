import { Router } from 'express';
import { getComunas } from '../controllers/comunas';

const router = Router();
router.get('/', getComunas);
export default router;
