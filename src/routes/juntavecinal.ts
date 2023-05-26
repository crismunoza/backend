import { Router } from 'express';

import { inserRep, insertJuntaVecinal, getJuntaVecinal }from '../controllers/juntaVecinal';

const router = Router();

router.post('/', insertJuntaVecinal);
router.post('/insercion', inserRep);
router.get('/mostrarjunta/:fk_id_comuna', getJuntaVecinal);
export default router;