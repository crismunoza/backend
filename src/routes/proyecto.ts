import { Router } from 'express';
import proyectoController from '../controllers/proyecto';

const router = Router();
 
router.post('/agregar-proyecto', proyectoController.insertProyect);
router.get('/obtener-proyectos/:idJuntaVecinal', proyectoController.getProyects);
router.get('/filtro-proyectos', proyectoController.getFilters);
router.post('/obtener-proyectos-filtros', proyectoController.getProyectsWithFilters);
router.put('/modificar-proyecto/:idProyecto', proyectoController.updateProyect);
router.delete('/eliminar-proyecto/:idProyecto', proyectoController.deleteProyect);
router.get('/obtener-excel/:id_proyecto/', proyectoController.generateExcel);
router.get('/filtro-proyectos-modificar', proyectoController.getFiltersForModify);

export default router;