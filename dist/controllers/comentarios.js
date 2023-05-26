"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getcomentarios = void 0;
const comentarios_1 = require("../models/comentarios");
//metodo para crear un comentario
const getcomentarios = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //creamos una constante para traer todos los comentarios con findAll
    const listcomentarios = yield comentarios_1.comentarios.findAll();
    //retornamos los comentarios en formato json
    res.json({ listcomentarios });
});
exports.getcomentarios = getcomentarios;
