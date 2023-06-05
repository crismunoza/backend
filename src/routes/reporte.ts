import { Router } from 'express';
import {CrearReport, verreporte} from '../controllers/reporte';

const router = Router();

router.get('/CrearReport/:id_junta_vecinal', CrearReport);

router.get('/verreporte', verreporte);

export default router;
