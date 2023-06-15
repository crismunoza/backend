import { QueryTypes } from "sequelize";
import db from "../db/connection";
import { Actividad, Certificado, Comuna, JuntaVecinal, Proyecto, Reporte, RepresentanteVecinal, Solicitud, Valoracion, Vecino } from "./mer";
import { Foreign } from "./relations";
import { queries } from "./queries";
import { Seeders } from "./seeders";

export function verificarTablas() {
  const foreign = new Foreign();
  const seeders = new Seeders();
  return new Promise<void>(async (resolve, reject) => {
    //**llamado a la query que permite saber la existencia de tablas en el esquema. */  
    const tableNameQuery = queries.existsTables

    try {
      const tables = await db.query(tableNameQuery, { type: QueryTypes.SELECT });
      if (tables.length > 0) {
        console.log(`Existen ${tables.length} tablas en el esquema C##JUNTA_VECINAL:`);
        resolve();
      } else {
        //**antes de crear las tablas se sincronizan las relaciones. */  
        const resultado = await foreign.uniones();
        console.log(resultado);
        await Comuna.sync();
        // await Municipalidad.sync();
        await JuntaVecinal.sync();
        await Proyecto.sync();
        await Reporte.sync();
        await RepresentanteVecinal.sync();
        await Actividad.sync();
        await Vecino.sync();
        await Certificado.sync();
        await Valoracion.sync();
        await Solicitud.sync();
        console.log(`Se ha creado el modelo en el esquema C##JUNTA_VECINAL:`);
        resolve();
        /**llamado a la promesa que ejecuta los inserts a las tablas correspondientes. */
        seeders.insertSeeders();
      }
    } catch (error) {
      reject(error);
    }
  });
}