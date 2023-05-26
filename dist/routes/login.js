"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("../controllers/user");
// import {verificarCorreo,cambiarContrasena } from "../controllers/resetpass";
// //creacion de la ruta para los usuarios
const router = (0, express_1.Router)();
// //ruta para crear un nuevo usuario y para el login
router.post('/ingresar', user_1.login);
router.get('/profile', user_1.profile);
// router.get('/', verificarCorreo);
// router.post('/reset', cambiarContrasena);
// //exportamos la ruta
exports.default = router;
