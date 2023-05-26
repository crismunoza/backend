import { Router } from 'express';
import proyectoController from '../controllers/proyecto';

const router = Router();
 
router.post('/agregar-proyecto', proyectoController.insertProyect);

export default router;