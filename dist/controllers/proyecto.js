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
const mer_1 = require("../models/mer");
const queries_1 = require("../models/queries");
const sqlTypes_1 = require("../types/sqlTypes");
class ProyectoController {
    constructor() {
        this.insertProyect = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { nombreProyecto, cupoMinimo, cupoMaximo, descripcion, fecha, imagen, fk_id_junta_vecinal } = req.body;
                //se asigna el valor activo al estado, ya que se está insertando el proyecto.
                const estado = 'Activo';
                //obtención max id a ingresar.
                const maxId = yield (0, queries_1.getMaxId)(this.modelName, 'id_proyecto');
                //crea el objeto de datos del proyecto de tipo ProyectoType.
                const proyectoData = {
                    id_proyecto: maxId,
                    nombre: nombreProyecto,
                    descripcion,
                    cupo_min: cupoMinimo,
                    cupo_max: cupoMaximo,
                    estado,
                    ruta_imagen: imagen,
                    fecha_proyecto: fecha,
                    fk_id_junta_vecinal: fk_id_junta_vecinal
                };
                //inserción del proyecto.
                const proyecto = yield mer_1.Proyecto.create(proyectoData);
                //response.
                return res.json({ resp: "Proyecto insertado exitosamente" });
            }
            catch (error) {
                //control nombre mensaje error.
                const errorMessage = ((_a = error === null || error === void 0 ? void 0 : error.parent) === null || _a === void 0 ? void 0 : _a.message) || (error === null || error === void 0 ? void 0 : error.message);
                console.log(errorMessage);
                if (errorMessage === "ORA-00001: restricción única (C##JUNTA_VECINAL.proyecto_nombre_unique) violada") {
                    // return res.send("El nombre del proyecto ya existe");
                    return res.status(400).json({ resp: "El nombre del proyecto ya existe", error: '0' });
                }
                else {
                    if (errorMessage === "ORA-00001: restricción única (C##JUNTA_VECINAL.proyecto_descripcion_unique) violada") {
                        return res.status(400).json({ resp: "La descripción ya existe", error: '1' });
                    }
                    else {
                        return res.status(400).json({ resp: "Error al insertar el proyecto", error: '-1' });
                    }
                }
            }
        });
        this.modelName = sqlTypes_1.SQLTableNameValues.proyecto;
    }
}
const proyectoController = new ProyectoController();
exports.default = proyectoController;
