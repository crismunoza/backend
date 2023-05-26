"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("../controllers/user");
//creacion de la ruta para los usuarios
const router = (0, express_1.Router)();
//ruta para crear un nuevo usuario y para el login
router.post('/', user_1.newUsuario);
router.post('/login', user_1.login);
//exportamos la ruta
exports.default = router;
