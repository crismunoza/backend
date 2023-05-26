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
exports.profile = exports.login = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mer_1 = require("../models/mer");
//login
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('llega');
    const cuerpo = req.body;
    console.log(cuerpo);
    var respuesta = '';
    var rol = '';
    // const existeUser = await User.findOne({where:{contrasenia: cuerpo.rut_user}});
    try {
        // le indicamos a la const de tipo any, ya qpor defecto el atributop q devuelva sera un strg y entrara en conflicto con lo q espera bycript y el modelo del mer
        const EsRepre = yield mer_1.RepresentanteVecinal.findOne({ where: { rut_representante: cuerpo.rut_representante } });
        if (EsRepre !== null) {
            // const EsVecino = await Vecino.findOne({attributes: ['rut_vecino','contrasenia'],where:{rut_vecino: cuerpo.rut_user}});
            // if(!EsVecino){
            //     return;
            // }
            // respuesta = 'Es vecino';
            // return respuesta;
            respuesta = 'representante';
            const validPassword = yield bcrypt_1.default.compare(cuerpo.contrasenia, EsRepre.contrasenia);
            if (validPassword === true) {
                //const nombre = EsRepre.primer_nombre;
                const id = EsRepre.id_representante_vecinal;
                const rol = 'admin';
                const token = jsonwebtoken_1.default.sign({
                    rut_representante: cuerpo.rut_representante,
                }, process.env.SECRET_KEY || "secretkey"); // se le puede agregar que espere 1 hora para que expire {expiresIn: 60 * 60}
                const alo = [] = [id, token, rol];
                return res.json({ alo });
            }
            else {
                const alo = [] = [respuesta, 'clave invalida'];
                return res.json({ alo });
            }
        }
        else {
            respuesta = 'no existe usario';
            return res.json({ respuesta });
        }
        // else{    
        //     console.log(respuesta)
        //     respuesta = 'Es representante';
        //     const validPassword = await bcrypt.compare(cuerpo.contrasenia,EsRepre.contrasenia);
        //     if(validPassword === true){
        //         const alo = [] = [respuesta,'RepVec'];
        //         return alo;
        //     }
        //     else{
        //         const alo = [] = [respuesta,'clave invalida'];
        //         return alo;
        //     }
        // }
    }
    catch (_a) {
        console.log(respuesta);
        respuesta = 'no existe usario';
        return res.json({ respuesta });
    }
});
exports.login = login;
const profile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, rol } = req.query;
    let respuesta = '';
    if (rol === 'admin') {
        try {
            const user = yield mer_1.RepresentanteVecinal.findOne({
                where: { id_representante_vecinal: id },
            });
            if (user !== null) {
                const id_us = user.id_representante_vecinal;
                const rut = user.rut_representante;
                const nombre = user.primer_nombre;
                const pApellido = user.primer_apellido;
                const path = user.avatar;
                const id_jun = user.fk_id_junta_vecinal;
                const datos = [id_us, rut, nombre, pApellido, path, id_jun];
                return res.status(200).json({ datos });
            }
        }
        catch (error) {
            console.error('Error al obtener el perfil del representante:', error);
            return res.status(404).json({
                msg: 'Hay un error con el perfil del representante',
            });
        }
    }
    else if (rol === 'vecino') {
        try {
            const user = yield mer_1.RepresentanteVecinal.findOne({
                where: { id_representante_vecinal: id },
            });
            if (user !== null) {
                const id_us = user.id_representante_vecinal;
                const rut = user.rut_representante;
                const nombre = user.primer_nombre;
                const pApellido = user.primer_apellido;
                const path = user.avatar;
                const id_jun = user.fk_id_junta_vecinal;
                const datos = [id_us, rut, nombre, pApellido, path, id_jun];
                return res.status(200).json({ datos });
            }
        }
        catch (error) {
            console.error('Error al obtener el perfil del representante:', error);
            return res.status(404).json({
                msg: 'Hay un error con el perfil del representante',
            });
        }
    }
    else {
        respuesta = 'Usuario no existe';
        return res.json({ respuesta });
    }
});
exports.profile = profile;
// // // es una funcion asincrona que recibe el request y el response de express
// // //metodo para registrar un usuario
// // //tiene que ser async por que tiene que esperar respuesta de base de datos y por que tenemos un await
// // export const newUsuario = async (req: Request, res: Response) => {
// //     //trayendo los datos del body
// //     const{correo,contrasena} = req.body;
// //     //validar que el correo exista
// //     const existeCorreo = await usuario.findOne({where:{correo: correo}});
// //     if (existeCorreo) {
// //         return res.status(400).json({
// //             msg: `Ya existe el corre ${correo}`
// //         })
// //     }
// //     //contraseña encriptada
// //     const hashpasword = await bcrypt.hash(contrasena, 10);
// //    //creando el usuario
// //    try {
// //     await usuario.create({ 
// //         //creamos la tabla con los datos que se van a enviar
// //         correo: correo,
// //         contrasena: hashpasword
// //     })
// //     res.json({
// //         msg: `correo ${correo} registrado exitosamente!`,
// //     })
// //    } catch (error) {
// //     res.status(400).json({
// //         msg: 'Error al registrar usuario',
// //     })
// //    }
// // };
// // //metodo para logearse
// // export const login = async (req: Request, res: Response) => {
// //     const{correo,contrasena} = req.body;
// //     //validar que el correo exista
// //     const existeCorreo:any = await usuario.findOne({where:{correo: correo}});
// //     //si no existe el correo
// //     if (!existeCorreo) {
// //         return res.status(400).json({
// //             msg: `No existe el correo ${correo}, debe registrarse`
// //         })
// //     }
// //     //validar password  bcrypt.compare(myPlaintextPassword, hash)
// //     const validPassword = await bcrypt.compare(contrasena, existeCorreo.contrasena);
// //     if(!validPassword){
// //         return res.status(400).json({
// //             msg: 'contraseña no valida'
// //         })
// //     }
// //     //generar el token devolviedo el correo
// //     const token = jwt.sign({
// //       correo: correo,
// //     },process.env.SECRET_KEY || "secretkey"); // se le puede agregar que espere 1 hora para que expire {expiresIn: 60 * 60}
// //      res.json(token);
// // };
