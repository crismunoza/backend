import { Request, Response } from 'express';
import { JuntaVecinal, RepresentanteVecinal } from '../models/mer';

export const insertJuntaVecinal = async (req: Request, res: Response) => {
    const data = req.body;    
    try {
        const existeJuntaVecinal =  await JuntaVecinal.findOne({where: {razon_social: data.razon_social}});
        if (existeJuntaVecinal !== null){
            return res.status(400).json({
                msg: `La junta vecinal ya se encuentra registrada.`
            })
        }
        else {
            const juntaVEcinal =  await JuntaVecinal.create({ 
                razon_social: data.razon_social,
                direccion: data.direccion,
                numero_calle: data.numero_calle,
                rut_junta: data.rut_junta,
                fk_id_comuna: data.id_comuna                
            },
            );
            const idJuntaVecinal = await JuntaVecinal.findOne({ attributes: ['id_junta_vecinal'], where: { rut_junta: data.rut_junta } });
            console.log('que trae la consulta',idJuntaVecinal)
            //convertimos a la IdJunta... en un objeto y obtenemos el valor de este
            let aaa= idJuntaVecinal ? Object.values(idJuntaVecinal.toJSON()) : null;
            //ahora covertimos la array q nos devolvio en un string
            let b = aaa?.toString( );
            //aqui creamos una variable json que retornaremos como respuesta
            return res.json({
                id: b,
                msg: 'ok'
            });
        }
    } catch( error ) {
        console.error('Error al insertar los datos en la tabla junta_vecinal:', error);

    }
}; 

export const getJuntaVecinal = async (req: Request, res: Response) => {
    try {
      const fk_id_comuna = req.params.fk_id_comuna; // Obtener el ID de la comuna desde los parámetros de la URL
      const listJuntaVecinal = await JuntaVecinal.findAll({
        where: { fk_id_comuna }, // Filtrar por el ID de la comuna
        attributes: ['id_junta_vecinal', 'razon_social'],
      });
      res.json({ listJuntaVecinal });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Ocurrió un error al obtener las juntas vecinales.' });
    }
};

export const inserRep = async(req:Request, res : Response)=>{
    
    const datoRep = req.body; 
    try {
        const RepExistente = await RepresentanteVecinal.findOne({where: {rut_representante: datoRep.rut_representante}});
        if (RepExistente !== null){
            return res.status(401).json({
                msg: `El represenatante ya se encuentra en el sistema.`
            })
        }
        else{             
            //agregamos enseguida el 1er rep con los datos de la creacion anterior 
            
            const RepVec = await  RepresentanteVecinal.create({ 
                rut_representante: datoRep.rut_representante,
                primer_nombre: datoRep.primer_nombre,
                segundo_nombre: datoRep.segundo_nombre,
                primer_apellido: datoRep.primer_apellido,
                segundo_apellido: datoRep.segundo_apellido,
                comuna_rep: datoRep.comuna_rep,
                direccion: datoRep.direccion_rep, 
                numero: datoRep.numero_rep,
                correo_electronico: datoRep.correo_electronico, 
                telefono: datoRep.telefono, 
                contrasenia: datoRep.contrasenia, 
                avatar: datoRep.avatar,
                ruta_evidencia: datoRep.ruta_evidencia, 
                ruta_firma: datoRep.ruta_firma, 
                fk_id_junta_vecinal: datoRep.id_junta_vecinal        
            },
            );
            return res.json({ msg:'yes'});   
        }
    }
    catch{
        console.log('hay un error')
    }
};
   
