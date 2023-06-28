import { Router } from 'express';
import { inserRep, insertJuntaVecinal, getJuntaVecinal, cantRep,inserRep2, getRep, updatereprese } from '../controllers/juntaVecinal';

const router = Router();

router.post('/', insertJuntaVecinal);
router.post('/insercion', inserRep);
router.post('/insercion2', inserRep2);
router.get('/mostrarjunta/:fk_id_comuna', getJuntaVecinal);
router.get('/cantidad/Rep/:id_junta', cantRep)
router.get('/representantes/:idJuntaVec', getRep)
router.put('/repreupdate/:rut_representante', updatereprese);
export default router;