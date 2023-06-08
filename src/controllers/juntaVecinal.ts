import { Request, Response } from 'express';
import { JuntaVecinal, RepresentanteVecinal } from '../models/mer';
import bcrypt from 'bcrypt';
import { decodeBase64Image } from '../utils/imageUtils';
import path from "path";
import fs from "fs";

export const insertJuntaVecinal = async (req: Request, res: Response) => {
    const data = req.body;    
    //console.log('ingresa al servicio')   
        const existeJuntaVecinal =  await JuntaVecinal.findOne({where: {rut_junta: data.rut_junta}});
        //console.log('QQQQQQ',existeJuntaVecinal)
        if (existeJuntaVecinal){
            //console.log('estra aqui')
            return res.json({
                status:400,
                msg: `La junta vecinal ya se encuentra registrada.`
            })
        }
        else {
            //console.log('entra a crear la junta')
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
                status:200,
                id: b,
                msg: `ok`
            });
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
            console.log('entra a q existe rep ')
            JuntaVecinal.destroy({where:{id_junta_vecinal:datoRep.id_junta_vecinal}});
            return res.json({
                msg: `El represenatante ya se encuentra en el sistema, no se realiza la creación de la junta vecinal`
            })
        }
        else{             
            //agregamos enseguida el 1er rep con los datos de la creacion anterior 
            //encryptamos la contraseña para q quede almacenada en la bda
            const passhash = await bcrypt.hash(datoRep.contrasenia,10);
            //ahora decodificaremos la img 
            const imageBuffer = decodeBase64Image(datoRep.ruta_firma);
            console.log("ruta_evidencia:", imageBuffer);
            
            // Genera un nombre de archivo único para la imagen
            const imageName = `firma-${datoRep.rut_representante}.jpg`;
        
            // Ruta de la carpeta donde se guardarán las imágenes
            const imageFolder = path.join(__dirname, "../../src/utils/evidencia_firma_rep");
                
            // Ruta completa de la imagen
            const imagePath = path.join(imageFolder, imageName);
            // Crea la carpeta si no existe
            if (!fs.existsSync(imageFolder)) {
                fs.mkdirSync(imageFolder, { recursive: true });
            }
            // Guarda la imagen en el sistema de archivos
            fs.writeFileSync(imagePath, imageBuffer);
        
            // Obtiene la URL de la imagen guardada
            const imageUrl = `src/utils/evidencia_firma_rep/${imageName}`;

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
                contrasenia: passhash, 
                avatar: datoRep.avatar,
                ruta_evidencia: datoRep.ruta_evidencia, 
                ruta_firma: imageUrl, 
                fk_id_junta_vecinal: datoRep.id_junta_vecinal        
            },
            );
            return res.json({ msg:'yes'});   
        }
    }
    catch(error) {
        console.log('hay un error')
    }
};

export const cantRep = async (req:Request, res:Response) => {
    const id = req.params.id_junta;
    try{    
        const {count,rows} = await RepresentanteVecinal.findAndCountAll({where:{fk_id_junta_vecinal:id}});
        if(!count){
            return res.json({ status:400,respuesta:'no se econtraron datos'});   
        }
        return res.json({ status:200,respuesta:count});
    }
    catch(error){
      return res.json({status:404, respuesta:error});
    }
};
   