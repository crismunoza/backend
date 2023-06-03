import { Router } from 'express';
import { ObtenerEstrellas, enviarSolicitud, listarValoraciones } from '../controllers/valoracion';

const router = Router();
/**
 * Distinción de rutas según la información que se necesita manipular.
 */

router.post('/enviar', enviarSolicitud);
router.get('/obtenerStar/:id', ObtenerEstrellas);
router.get('/listarValoraciones/:id_junta',listarValoraciones);

export default router;