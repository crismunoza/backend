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
exports.verificarTablas = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
const mer_1 = require("./mer");
const relations_1 = require("./relations");
const queries_1 = require("./queries");
const seeders_1 = require("./seeders");
function verificarTablas() {
    const foreign = new relations_1.Foreign();
    const seeders = new seeders_1.Seeders();
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        //**llamado a la query que permite saber la existencia de tablas en el esquema. */  
        const tableNameQuery = queries_1.queries.existsTables;
        try {
            const tables = yield connection_1.default.query(tableNameQuery, { type: sequelize_1.QueryTypes.SELECT });
            if (tables.length > 0) {
                console.log(`Existen ${tables.length} tablas en el esquema C##JUNTA_VECINAL:`);
                resolve();
            }
            else {
                //**antes de crear las tablas se sincronizan las relaciones. */  
                const resultado = yield foreign.uniones();
                console.log(resultado);
                yield mer_1.Comuna.sync();
                // await Municipalidad.sync();
                yield mer_1.JuntaVecinal.sync();
                yield mer_1.Proyecto.sync();
                yield mer_1.Reporte.sync();
                yield mer_1.RepresentanteVecinal.sync();
                yield mer_1.Actividad.sync();
                yield mer_1.Vecino.sync();
                yield mer_1.Certificado.sync();
                yield mer_1.Valoracion.sync();
                yield mer_1.Solicitud.sync();
                console.log(`Se ha creado el modelo en el esquema C##JUNTA_VECINAL:`);
                resolve();
                /**llamado a la promesa que ejecuta los inserts a las tablas correspondientes. */
                seeders.insertSeeders();
            }
        }
        catch (error) {
            reject(error);
        }
    }));
}
exports.verificarTablas = verificarTablas;
