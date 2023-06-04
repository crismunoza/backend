import { Router } from 'express';
import {CrearReport} from '../controllers/reporte';

const router = Router();

router.get('/CrearReport/:id_junta_vecinal', CrearReport);

export default router;
