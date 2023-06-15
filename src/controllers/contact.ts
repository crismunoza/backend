import { Request, Response } from 'express';
import { QueryTypes } from 'sequelize';
import db from '../db/connection';

export const vercontacto = async (req: Request, res: Response) => {
  const { id_junta_vecinal } = req.params;
  try {
    const query = `
      SELECT 
        "comuna"."nombre",
        "junta_vecinal"."direccion",
        "junta_vecinal"."numero_calle",
        "junta_vecinal"."rut_junta",
        "junta_vecinal"."razon_social",
        "representante_vecinal"."primer_nombre",
        "representante_vecinal"."segundo_nombre",
        "representante_vecinal"."primer_apellido",
        "representante_vecinal"."segundo_apellido",
        "representante_vecinal"."correo_electronico",
        "representante_vecinal"."telefono"
        FROM "comuna"
        INNER JOIN "junta_vecinal" ON "comuna"."id_comuna" = "junta_vecinal"."fk_id_comuna"
        INNER JOIN "representante_vecinal" ON "junta_vecinal"."id_junta_vecinal" = "representante_vecinal"."fk_id_junta_vecinal"
        WHERE "junta_vecinal"."id_junta_vecinal" = :id_junta_vecinal;
        `;

    const vercontacto = await db.query(query, {
      replacements: { id_junta_vecinal },
      type: QueryTypes.SELECT,
    });

    res.json({
      data: vercontacto,
    });
  } catch (e) {
    console.log(e);
  }
};