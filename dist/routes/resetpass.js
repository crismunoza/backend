"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const resetpass_1 = require("../controllers/resetpass");
//creacion de la ruta para los usuarios
const router = (0, express_1.Router)();
//ruta para crear un nuevo usuario y para el login
// router.get('/', cambiarContrasena);
router.get('/', resetpass_1.verificarCorreo);
router.post('/reset', resetpass_1.cambiarContrasena);
//exportamos la ruta
exports.default = router;
