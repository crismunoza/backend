import { Router } from "express";
import { insertvecino, getvecinos, deletevecino, updatevecino, listarADD, noacepptado, modificarEstado, verificarsiexiste } from "../controllers/vecinos";

const router = Router();

//ruta del modulo del registro de vecinos
router.post('/', insertvecino);
// ruta para el modulo de editar vecinos 
router.get('/listVecinos', getvecinos);
router.delete('/deletevecino/:rut_vecino', deletevecino);
router.put('/updatevecino/:rut_vecino', updatevecino);
//ruta de modulo de aceptar vecinos
router.get('/listarADD', listarADD);
router.delete('/noacepptado/:rut_vecino', noacepptado);
router.post('/modificarEstado', modificarEstado);
//ruta de verificacion de si existe el vecino
router.get('/verificarsiexiste/:rut', verificarsiexiste);
export default router;