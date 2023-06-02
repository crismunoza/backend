
import { Request, Response } from 'express';
import { Valoracion } from '../models/mer';
import { QueryTypes, json } from 'sequelize';
import db from '../db/connection';

export const enviarSolicitud = async (req: Request, res: Response) => {
    const {opinion,estrellas,id_v} = req.body;

    try{
        let valo = await Valoracion.create({
            comentario:opinion,
            cantidad_estrellas:estrellas,
            estado_solicitud: 'no aplica',
            fk_id_vecino:id_v
        });
        if(valo){
            res.json({'status':200,'msg':'ok'});
        }
        
    }
    catch(error){
        console.error('q error nos trae', error)
    }
};

export const ObtenerEstrellas =async (req:Request, res:Response) => {
    
    const id = req.params.id;
    console.log('llega al servicio ',id)
        // consulta para traer por estrellas ahora a revisar por vecinos
    const q = ` 
    Select 
    COUNT(CASE WHEN "valoracion"."cantidad_estrellas" = 1 THEN 1 END) AS "1 estrella",
         COUNT(CASE WHEN "valoracion"."cantidad_estrellas" = 2 THEN 1 END) AS "2 estrella",
         COUNT(CASE WHEN "valoracion"."cantidad_estrellas" = 3 THEN 1 END) AS "3 estrella",
         COUNT(CASE WHEN "valoracion"."cantidad_estrellas" = 4 THEN 1 END) AS "4 estrella",
        COUNT(CASE WHEN "valoracion"."cantidad_estrellas" = 5 THEN 1 END) AS "5 estrella" 
        from "junta_vecinal" 
        left JOIN "vecino" on "junta_vecinal"."id_junta_vecinal"="vecino"."fk_id_junta_vecinal" 
        left JOIN "valoracion" on "vecino"."id_vecino"="valoracion"."fk_id_vecino" 
        where "junta_vecinal"."id_junta_vecinal" =${id}`;
        const estrellas = await db.query(q, {
            type: QueryTypes.SELECT,
          }); 
          
     res.json({estrellas});
}