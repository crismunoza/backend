"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const comentarios_1 = require("../controllers/comentarios");
//creacion de la ruta para los comentarios
const router = (0, express_1.Router)();
//ruta para obtener los comentarios y validar el token
router.get('/', comentarios_1.getcomentarios);
//exportamos la ruta
exports.default = router;
