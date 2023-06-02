import { Router } from 'express';
import { enviarSolicitud } from '../controllers/valoracion';

const router = Router();
/**
 * Distinción de rutas según la información que se necesita manipular.
 */

router.post('/enviar', enviarSolicitud);

export default router;