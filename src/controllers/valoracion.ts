import { Request, Response } from 'express';
import { Valoracion } from '../models/mer';

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