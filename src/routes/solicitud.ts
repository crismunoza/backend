import { Router } from "express";
import { newsolicitud, getsolicitudes, versolicitudes, updateSolicitud } from "../controllers/solicitud";

const router = Router();

router.post('/', newsolicitud);
router.get('/listsolicitud', getsolicitudes);

//obetener las lista de solicitudes por junta vecinal
router.get('/versolicitudes', versolicitudes);
//responder solicitudes 
router.put('/update/:id_solicitud', updateSolicitud);

export default router;