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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cambiarContrasena = exports.verificarCorreo = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = require("../models/user");
//metodo para cambiar contraseña
const verificarCorreo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { correo } = req.query;
    // console.log('ESTO ES EL BACKEND',correo)
    try {
        const verificar = yield user_1.usuario.findOne({ where: { correo } });
        if (verificar) {
            res.json({
                msg: `El correo ${correo} se encuentra registrado`
            });
        }
        else {
            res.status(400).json({
                msg: `No se encuentra registrado el correo ${correo}`
            });
        }
    }
    catch (error) {
        console.log(error);
        res.json({
            msg: `Upps ocurrio un error, comuniquese con soporte`
        });
    }
});
exports.verificarCorreo = verificarCorreo;
const cambiarContrasena = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { correo, contrasena } = req.body;
    try {
        // console.log('ESTO ES EL BACKEND cambiarcontraseña',correo,contrasena)
        const verificar = yield user_1.usuario.findOne({ where: { correo } });
        if (verificar) {
            const hashpasword = yield bcrypt_1.default.hash(contrasena, 10);
            yield verificar.update({ contrasena: hashpasword });
            res.json({
                msg: 'Se actualizo la contraseña exitosamente'
            });
        }
        else {
            res.status(400).json({
                msg: `No se encuentra registrado el correo ${correo}`
            });
        }
    }
    catch (error) {
        console.log(error);
        res.json({
            msg: `Upps ocurrio un error, comuniquese con soporte`
        });
    }
});
exports.cambiarContrasena = cambiarContrasena;
