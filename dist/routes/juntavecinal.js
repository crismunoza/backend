"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const juntaVecinal_1 = require("../controllers/juntaVecinal");
const router = (0, express_1.Router)();
router.post('/', juntaVecinal_1.insertJuntaVecinal);
router.post('/insercion', juntaVecinal_1.inserRep);
router.get('/mostrarjunta/:fk_id_comuna', juntaVecinal_1.getJuntaVecinal);
exports.default = router;
