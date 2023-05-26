"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const vecinos_1 = require("../controllers/vecinos");
const router = (0, express_1.Router)();
//ruta del modulo del registro de vecinos
router.post('/', vecinos_1.insertvecino);
// ruta para el modulo de editar vecinos 
router.get('/listVecinos', vecinos_1.getvecinos);
router.delete('/deletevecino/:rut_vecino', vecinos_1.deletevecino);
router.put('/updatevecino/:rut_vecino', vecinos_1.updatevecino);
//ruta de modulo de aceptar vecinos
router.get('/listarADD', vecinos_1.listarADD);
router.delete('/noacepptado/:rut_vecino', vecinos_1.noacepptado);
router.post('/modificarEstado', vecinos_1.modificarEstado);
exports.default = router;
