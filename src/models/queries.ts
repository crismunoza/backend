import { QueryTypes } from "sequelize";
import db from "../db/connection";
export const queries = {
  //**query que comprueba la existencia de tablas en el esquema. */
  existsTables: `SELECT table_name FROM all_tables WHERE owner = 'C##JUNTA_VECINAL';`,
}
export const getMaxId = async (modelName: string, idField: string): Promise<number> => {
  try {
    const Model = db.models[modelName];
    const result = await Model.max(idField);
    const maxId: number = Number(result) || 0;
    return maxId + 1;
  } catch (error) {
    console.error(`Error al obtener el máximo id de ${modelName}:`, error);
    throw error;
  }
};

export const storageProcedure = async (
  id_actividad: number,
  nombre_actividad: string,
  descripcion: string,
  ruta_imagen: string,
  fecha_actividad: string,
  id_representante_vecinal: number,
  tipo_proceso: number
): Promise<string> => {
  try {
    await db.query('BEGIN sp_insert_modify_publication(:id_actividad, :nombre_actividad, :descripcion, :ruta_imagen, :fecha_actividad, :id_representante_vecinal, :tipo_proceso); END;', {
      replacements: {
        id_actividad: id_actividad,
        nombre_actividad: nombre_actividad,
        descripcion: descripcion,
        ruta_imagen: ruta_imagen,
        fecha_actividad: fecha_actividad,
        id_representante_vecinal: id_representante_vecinal,
        tipo_proceso: tipo_proceso
      }
    });
    if (tipo_proceso === 0) {
      return 'Se ha insertado con éxito la información de la publicación';
    } else {
      return 'Se ha modificado con éxito la información de la publicación';
    }
  } catch (error) {
    console.error('Error al insertar el procedimiento almacenado', error);
    throw error;
  }
}

export const getPublication = async (id_junta_vecinal: number) => {
  try {
    const query =
      `SELECT
      a."id_actividad",
      a."nombre",
      a."descripcion",
      a."ruta_imagen",
      a."fecha_actividad"
      FROM "actividad" a
      JOIN "representante_vecinal" rv
      ON a."fk_id_representante_vecinal" = rv."id_representante_vecinal"
      JOIN "junta_vecinal" jv
      ON rv."fk_id_junta_vecinal" = jv."id_junta_vecinal"
      WHERE jv."id_junta_vecinal" = :id_junta_vecinal`;

    const obtenerPublicaciones = await db.query(query, {
      replacements: { id_junta_vecinal },
      type: QueryTypes.SELECT,
    });

    return obtenerPublicaciones;
  } catch (error) {
    console.error('Error al obtener las publicaciones', error);
    throw error;
  }
};

export const getProyects = async (id_junta_vecinal: number) => {
  try {
    const query =
      `SELECT
      p."id_proyecto",
      p."nombre",
      p."descripcion",
      p."cupo_min",
      p."cupo_max",
      p."estado",
      p."ruta_imagen",
      p."fecha_proyecto",
      p."fk_id_junta_vecinal" 
      FROM "proyecto" p
      JOIN "junta_vecinal" jv 
      ON p."fk_id_junta_vecinal" = jv."id_junta_vecinal"
      WHERE jv."id_junta_vecinal" = :id_junta_vecinal
      ORDER BY "id_proyecto" ASC; `;

    const obtenerProyectos = await db.query(query, {
      replacements: { id_junta_vecinal },
      type: QueryTypes.SELECT,
    });

    return obtenerProyectos;
  } catch (error) {
    console.error('Error al al obtener los proyectos', error);
    throw error;
  }

};
