import { Request, Response } from "express";
import { Solicitud, Vecino } from "../models/mer";
import { Sequelize, QueryTypes } from "sequelize";
import db from "../db/connection";

export const newsolicitud = async (req: Request, res: Response) => {
    const { titulo_solicitud, asunto_solicitud, descripcion, estado_solicitud, fk_id_vecino } = req.body;
    try {
        let solicitud = await Solicitud.create({
            titulo_solicitud,
            asunto_solicitud,
            descripcion,
            estado_solicitud,
            fk_id_vecino
        });
        if (solicitud) {
            return res.json({
                message: 'Solicitud creada correctamente',
                data: solicitud
            })
        }
    } catch (e) {
        console.log("error del backend", e);
        res.status(500).json({
            message: 'Error al crear solicitud',

        })
    }
};
export const getsolicitudes = async (req: Request, res: Response) => {
    try {
        const listsolicitud = await Solicitud.findAll();
        res.json({
            data: listsolicitud
        });
    } catch (e) {
        console.log(e);
    }
}

export const versolicitudes = async (req: Request, res: Response) => {
    try {
        const query = `
      SELECT
      "solicitud"."id_solicitud",
      "solicitud"."titulo_solicitud",
      "solicitud"."asunto_solicitud",
      "solicitud"."descripcion",
      "solicitud"."estado_solicitud",
      "solicitud"."fk_id_vecino",
      TO_CHAR("solicitud"."createdAt", 'YYYY-MM-DD') AS "createdAt",
      "solicitud"."respuesta",
      "vecino"."primer_nombre",
      "vecino"."primer_apellido",
      "vecino"."fk_id_junta_vecinal"
       FROM "solicitud"
       INNER JOIN "vecino" ON "solicitud"."fk_id_vecino" = "vecino"."id_vecino";
      `;

        const listsolicitud = await db.query(query, {
            type: QueryTypes.SELECT,
        });

        console.log("listsolicitud", listsolicitud);
        console.log(JSON.stringify(listsolicitud));

        res.json({
            data: listsolicitud,
        });
    } catch (e) {
        console.log(e);
    }
};

export const updateSolicitud = async (req: Request, res: Response) => {
    const { id_solicitud } = req.params;
    const { respuesta, estado_solicitud } = req.body;
    try {
        const solicitud = await Solicitud.update({
            estado_solicitud,
            respuesta,
        }, {
            where: {
                id_solicitud
            }
        });
        if (solicitud) {
            return res.json({
                message: 'Solicitud actualizada correctamente',
                data: solicitud
            })
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: 'Error al actualizar solicitud'
        })
    }
}