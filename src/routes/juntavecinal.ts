import { Router } from 'express';

import { inserRep, insertJuntaVecinal, getJuntaVecinal, cantRep }from '../controllers/juntaVecinal';

const router = Router();

router.post('/', insertJuntaVecinal);
router.post('/insercion', inserRep);
router.get('/mostrarjunta/:fk_id_comuna', getJuntaVecinal);
router.get('/cantidad/Rep/:id_junta', cantRep)
export default router;