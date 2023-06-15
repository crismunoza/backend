import {
    Comuna, JuntaVecinal, Proyecto, Reporte, RepresentanteVecinal, Actividad, Vecino, Certificado, Valoracion, Solicitud
} from "./mer";
export class Foreign {
    public async uniones(): Promise<string> {
        try {
            //**relation between comuna and municipalidad */
            // await Comuna.hasMany(Municipalidad, { foreignKey: 'fk_id_comuna' });
            //await Municipalidad.belongsTo(Comuna, { foreignKey: 'fk_id_comuna' });
            //**relation between municipalidad and junta_vecinal */
            await Comuna.hasMany(JuntaVecinal, { foreignKey: 'fk_id_comuna' });
            await JuntaVecinal.belongsTo(Comuna, { foreignKey: 'fk_id_comuna' });
            //**relation between junta_vecinal and proyecto*/
            await JuntaVecinal.hasMany(Proyecto, { foreignKey: 'fk_id_junta_vecinal' });
            await Proyecto.belongsTo(JuntaVecinal, { foreignKey: 'fk_id_junta_vecinal' });
            //**relation between proyecto and reporte*/
            await Proyecto.hasMany(Reporte, { foreignKey: 'fk_id_proyecto' });
            await Reporte.belongsTo(Proyecto, { foreignKey: 'fk_id_proyecto' });
            //**relation between junta_vecinal and representante_vecinal*/
            await JuntaVecinal.hasMany(RepresentanteVecinal, { foreignKey: 'fk_id_junta_vecinal' });
            await RepresentanteVecinal.belongsTo(JuntaVecinal, { foreignKey: 'fk_id_junta_vecinal' });
            //**relation between representante_vecinal and actividad*/
            await RepresentanteVecinal.hasMany(Actividad, { foreignKey: 'fk_id_representante_vecinal' });
            await Actividad.belongsTo(RepresentanteVecinal, { foreignKey: 'fk_id_representante_vecinal' });
            //**relation between junta_vecinal and vecino*/
            await JuntaVecinal.hasMany(Vecino, { foreignKey: 'fk_id_junta_vecinal' });
            await Vecino.belongsTo(JuntaVecinal, { foreignKey: 'fk_id_junta_vecinal' });
            //**relation between vecino and certificado*/
            await Vecino.hasMany(Certificado, { foreignKey: 'fk_id_vecino' });
            await Certificado.belongsTo(Vecino, { foreignKey: 'fk_id_vecino' });
            //**relation between vecino and valoracion*/
            await Vecino.hasMany(Valoracion, { foreignKey: 'fk_id_vecino' });
            await Valoracion.belongsTo(Vecino, { foreignKey: 'fk_id_vecino' });
            //**relation between vecino and solicitud*/
            await Vecino.hasMany(Solicitud, { foreignKey: 'fk_id_vecino' });
            await Solicitud.belongsTo(Vecino, { foreignKey: 'fk_id_vecino' });
            return "Tablas relacionadas correctamente."
        } catch (error) {
            throw new Error(`Error al relacionar las tablas: ${error}`);
        }
    }

}



