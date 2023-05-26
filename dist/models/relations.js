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
exports.Foreign = void 0;
const mer_1 = require("./mer");
class Foreign {
    uniones() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //**relation between comuna and municipalidad */
                // await Comuna.hasMany(Municipalidad, { foreignKey: 'fk_id_comuna' });
                //await Municipalidad.belongsTo(Comuna, { foreignKey: 'fk_id_comuna' });
                //**relation between municipalidad and junta_vecinal */
                yield mer_1.Comuna.hasMany(mer_1.JuntaVecinal, { foreignKey: 'fk_id_comuna' });
                yield mer_1.JuntaVecinal.belongsTo(mer_1.Comuna, { foreignKey: 'fk_id_comuna' });
                //**relation between junta_vecinal and proyecto*/
                yield mer_1.JuntaVecinal.hasMany(mer_1.Proyecto, { foreignKey: 'fk_id_junta_vecinal' });
                yield mer_1.Proyecto.belongsTo(mer_1.JuntaVecinal, { foreignKey: 'fk_id_junta_vecinal' });
                //**relation between proyecto and reporte*/
                yield mer_1.Proyecto.hasMany(mer_1.Reporte, { foreignKey: 'fk_id_proyecto' });
                yield mer_1.Reporte.belongsTo(mer_1.Proyecto, { foreignKey: 'fk_id_proyecto' });
                //**relation between junta_vecinal and representante_vecinal*/
                yield mer_1.JuntaVecinal.hasMany(mer_1.RepresentanteVecinal, { foreignKey: 'fk_id_junta_vecinal' });
                yield mer_1.RepresentanteVecinal.belongsTo(mer_1.JuntaVecinal, { foreignKey: 'fk_id_junta_vecinal' });
                //**relation between representante_vecinal and actividad*/
                yield mer_1.RepresentanteVecinal.hasMany(mer_1.Actividad, { foreignKey: 'fk_id_representante_vecinal' });
                yield mer_1.Actividad.belongsTo(mer_1.RepresentanteVecinal, { foreignKey: 'fk_id_representante_vecinal' });
                //**relation between junta_vecinal and vecino*/
                yield mer_1.JuntaVecinal.hasMany(mer_1.Vecino, { foreignKey: 'fk_id_junta_vecinal' });
                yield mer_1.Vecino.belongsTo(mer_1.JuntaVecinal, { foreignKey: 'fk_id_junta_vecinal' });
                //**relation between vecino and certificado*/
                yield mer_1.Vecino.hasMany(mer_1.Certificado, { foreignKey: 'fk_id_vecino' });
                yield mer_1.Certificado.belongsTo(mer_1.Vecino, { foreignKey: 'fk_id_vecino' });
                //**relation between vecino and valoracion*/
                yield mer_1.Vecino.hasMany(mer_1.Valoracion, { foreignKey: 'fk_id_vecino' });
                yield mer_1.Valoracion.belongsTo(mer_1.Vecino, { foreignKey: 'fk_id_vecino' });
                //**relation between vecino and solicitud*/
                yield mer_1.Vecino.hasMany(mer_1.Solicitud, { foreignKey: 'fk_id_vecino' });
                yield mer_1.Solicitud.belongsTo(mer_1.Vecino, { foreignKey: 'fk_id_vecino' });
                return "Tablas relacionadas correctamente.";
            }
            catch (error) {
                throw new Error(`Error al relacionar las tablas: ${error}`);
            }
        });
    }
}
exports.Foreign = Foreign;
