import { Router } from 'express';
import { ObtenerEstrellas, enviarSolicitud } from '../controllers/valoracion';

const router = Router();
/**
 * Distinción de rutas según la información que se necesita manipular.
 */

router.post('/enviar', enviarSolicitud);
router.get('/obtenerStar/:id', ObtenerEstrellas);

export default router;