import { Router } from 'express';
import { CrearReport, verreporte, inserReport, getReport, getVecinosInscritos } from '../controllers/reporte';

const router = Router();

router.get('/CrearReport/:id_junta_vecinal', CrearReport);
router.get('/verreporte', verreporte);
router.post('/agregar-reporte', inserReport);
router.get('/obtener-reportes/:rut_vecino', getReport);
router.get('/count-vecinos-inscritos/:id_proyecto', getVecinosInscritos);

export default router;
