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
exports.modificarEstado = exports.noacepptado = exports.listarADD = exports.deletevecino = exports.getvecinos = exports.updatevecino = exports.insertvecino = void 0;
const fs_1 = __importDefault(require("fs")); // Importa el módulo fs para trabajar con el sistema de archivos
const path_1 = __importDefault(require("path")); // Importa el módulo path para manejar rutas de archivos y directorios
const mer_1 = require("../models/mer"); // Importa el modelo Vecino desde ../models/mer
const imageUtils_1 = require("../utils/imageUtils"); // Importa una función utilitaria para decodificar la imagen Base64
const bcrypt_1 = __importDefault(require("bcrypt"));
// Aqui empieza el metodo para insertar vecinos modulo de registro de vecinos
const insertvecino = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Obtiene los datos del cuerpo de la solicitud
    const { rut_vecino, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, direccion, correo_electronico, telefono, contrasenia, avatar, ruta_evidencia, estado, fk_id_junta_vecinal } = req.body;
    console.log(req.body);
    //contraseña encriptada
    const hashpasword = yield bcrypt_1.default.hash(contrasenia, 10);
    try {
        // Decodifica la imagen codificada en Base64
        const imageBuffer = (0, imageUtils_1.decodeBase64Image)(ruta_evidencia);
        console.log("ruta_evidencia:", imageBuffer);
        // Genera un nombre de archivo único para la imagen
        const imageName = `${rut_vecino}.jpg`;
        // Ruta de la carpeta donde se guardarán las imágenes
        const imageFolder = path_1.default.join(__dirname, "../../src/utils/evidencia");
        // Crea la carpeta si no existe
        if (!fs_1.default.existsSync(imageFolder)) {
            fs_1.default.mkdirSync(imageFolder, { recursive: true });
        }
        // Ruta completa de la imagen
        const imagePath = path_1.default.join(imageFolder, imageName);
        // Guarda la imagen en el sistema de archivos
        fs_1.default.writeFileSync(imagePath, imageBuffer);
        // Obtiene la URL de la imagen guardada
        const imageUrl = `C:/Users/Christian/Desktop/plantilla/backend/src/utils/evidencia/${imageName}`;
        console.log("ruta_evidencia:", imageName);
        const vecino = yield mer_1.Vecino.create({
            rut_vecino,
            primer_nombre,
            segundo_nombre,
            primer_apellido,
            segundo_apellido,
            direccion,
            correo_electronico,
            telefono,
            contrasenia: hashpasword,
            avatar,
            ruta_evidencia: imageUrl,
            estado,
            fk_id_junta_vecinal
        });
        console.log("LOQUE LLEGA EN VECINO", vecino);
        return res.json({
            msg: 'Se insertó correctamente',
            vecino
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Error al insertar el vecino'
        });
    }
});
exports.insertvecino = insertvecino;
// Aqui termina el metodo para insertar vecinos modulo de registro de vecinos
// Aqui empezamos con el modulo de editar vecinos todos estos son los controles hacia abajo 
const updatevecino = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Obtiene el valor del parámetro rut_vecino de la solicitud
    const { rut_vecino } = req.params;
    // Obtiene los datos del cuerpo de la solicitud
    const { primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, direccion, correo_electronico, telefono, contrasenia } = req.body;
    //contraseña encriptada
    const hashpasword = yield bcrypt_1.default.hash(contrasenia, 10);
    // Actualiza los datos del vecino en la base de datos
    const result = yield mer_1.Vecino.update({
        primer_nombre,
        segundo_nombre,
        primer_apellido,
        segundo_apellido,
        direccion,
        correo_electronico,
        telefono,
        contrasenia: hashpasword
    }, {
        where: {
            rut_vecino
        }
    });
    if (result[0] > 0) {
        return res.json({
            msg: 'Vecino actualizado correctamente'
        });
    }
    return res.json({
        msg: 'No se encontró el vecino'
    });
});
exports.updatevecino = updatevecino;
const getvecinos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Obtiene todos los vecinos de la base de datos con evidencia igual a true (1)
        const listVecinos = yield mer_1.Vecino.findAll({
            where: {
                estado: 1
            },
        });
        console.log("listVecinos", listVecinos);
        return res.json({ listVecinos });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Error al obtener los vecinos'
        });
    }
});
exports.getvecinos = getvecinos;
const deletevecino = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Obtiene el valor del parámetro rut_vecino de la solicitud
    const { rut_vecino } = req.params;
    // Elimina el vecino de la base de datos
    const deleteRowCount = yield mer_1.Vecino.destroy({
        where: {
            rut_vecino
        }
    });
    // Eliminar la imagen asociada
    const imagePath = `C:/Users/Christian/Desktop/plantilla/backend/src/utils/evidencia/${rut_vecino}.jpg`;
    fs_1.default.unlink(imagePath, (err) => {
        if (err) {
            console.error('Error al eliminar la imagen:', err);
            return res.status(500).json({ error: 'Error al eliminar la imagen' });
        }
        return res.json({
            msg: 'Vecino eliminado correctamente',
            count: deleteRowCount
        });
    });
});
exports.deletevecino = deletevecino;
// Aqui terminamos con el modulo de editar vecinos todos estos son los controles hacia arriba
// Aqui empezamos con el modulo de aceptar a un vecino todos estos son los controles hacia abajo
const listarADD = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Obtiene todos los vecinos de la base de datos con evidencia igual a true (1)
        const listVecinos = yield mer_1.Vecino.findAll({
            where: {
                estado: 0
            },
        });
        console.log("listVecinos", listVecinos);
        return res.json({ listVecinos });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Error al obtener los vecinos'
        });
    }
});
exports.listarADD = listarADD;
const noacepptado = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Obtiene el valor del parámetro rut_vecino de la solicitud
    const { rut_vecino } = req.params;
    // Elimina el vecino de la base de datos
    const deleteRowCount = yield mer_1.Vecino.destroy({
        where: {
            rut_vecino
        }
    });
    // Eliminar la imagen asociada
    const imagePath = `C:/Users/Christian/Desktop/plantilla/backend/src/utils/evidencia/${rut_vecino}.jpg`;
    fs_1.default.unlink(imagePath, (err) => {
        if (err) {
            console.error('Error al eliminar la imagen:', err);
            return res.status(500).json({ error: 'Error al eliminar la imagen' });
        }
        return res.json({
            msg: 'Vecino eliminado correctamente',
            count: deleteRowCount
        });
    });
});
exports.noacepptado = noacepptado;
const modificarEstado = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rut_vecino, estado } = req.body;
        // Buscar el vecino por el rut y modificar el estado
        yield mer_1.Vecino.update({ estado: estado }, { where: { rut_vecino: rut_vecino } });
        return res.status(200).json({ message: 'Estado modificado correctamente' });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error al modificar el estado del vecino' });
    }
});
exports.modificarEstado = modificarEstado;
