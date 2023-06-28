import { Request, Response } from 'express';
import { JuntaVecinal, RepresentanteVecinal } from '../models/mer';
import bcrypt from 'bcrypt';
import { decodeBase64Image } from '../utils/imageUtils';
import path from "path";
import fs from "fs";

export const insertJuntaVecinal = async (req: Request, res: Response) => {
    const data = req.body;
    //console.log('ingresa al servicio')   
    const existeJuntaVecinal = await JuntaVecinal.findOne({ where: { rut_junta: data.rut_junta } });
    //console.log('QQQQQQ',existeJuntaVecinal)
    if (existeJuntaVecinal) {
        //console.log('estra aqui')
        return res.json({
            status: 400,
            msg: `La junta vecinal ya se encuentra registrada.`
        })
    }
    else {
        //console.log('entra a crear la junta')
        const juntaVEcinal = await JuntaVecinal.create({
            razon_social: data.razon_social,
            direccion: data.direccion,
            numero_calle: data.numero_calle,
            rut_junta: data.rut_junta,
            fk_id_comuna: data.id_comuna
        },
        );
        const idJuntaVecinal = await JuntaVecinal.findOne({ attributes: ['id_junta_vecinal'], where: { rut_junta: data.rut_junta } });
        console.log('que trae la consulta', idJuntaVecinal)
        //convertimos a la IdJunta... en un objeto y obtenemos el valor de este
        let aaa = idJuntaVecinal ? Object.values(idJuntaVecinal.toJSON()) : null;
        //ahora covertimos la array q nos devolvio en un string
        let b = aaa?.toString();
        //aqui creamos una variable json que retornaremos como respuesta
        return res.json({
            status: 200,
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

export const inserRep = async (req: Request, res: Response) => {

    const datoRep = req.body;
    try {
        const RepExistente = await RepresentanteVecinal.findOne({ where: { rut_representante: datoRep.rut_representante } });
        if (RepExistente !== null) {
            console.log('entra a q existe rep ')
            JuntaVecinal.destroy({ where: { id_junta_vecinal: datoRep.id_junta_vecinal } });
            return res.json({
                msg: `El represenatante ya se encuentra en el sistema, no se realiza la creación de la junta vecinal`
            })
        }
        else {
            //agregamos enseguida el 1er rep con los datos de la creacion anterior 
            //encryptamos la contraseña para q quede almacenada en la bda
            const passhash = await bcrypt.hash(datoRep.contrasenia, 10);
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

            const RepVec = await RepresentanteVecinal.create({
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
            return res.json({ msg: 'yes' });
        }
    }
    catch (error) {
        console.log('hay un error')
    }
};


// insert del segundo representante vecinal
export const inserRep2 = async (req: Request, res: Response) => {

    const datoRep = req.body;
    try {
        const RepExistente = await RepresentanteVecinal.findOne({ where: { rut_representante: datoRep.rut_representante },attributes: ['rut_representante'] });
        if (RepExistente !== null) {
            console.log('entra a q existe rep ')
            JuntaVecinal.destroy({ where: { id_junta_vecinal: datoRep.id_junta_vecinal } });
            return res.json({
                msg: `El represenatante ya se encuentra en el sistema, no se realiza la creación de la junta vecinal`
            })
        }
        else {
            const idcomuna = await JuntaVecinal.findOne({
                where: { id_junta_vecinal: datoRep.id_junta_vecinal },
                attributes: ['fk_id_comuna']
              });
            const idcomuna2 = idcomuna?.getDataValue('fk_id_comuna');           
            //agregamos enseguida el 1er rep con los datos de la creacion anterior 
            //encryptamos la contraseña para q quede almacenada en la bda
            const passhash = await bcrypt.hash(datoRep.contrasenia, 10);
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

            const RepVec = await RepresentanteVecinal.create({
                rut_representante: datoRep.rut_representante,
                primer_nombre: datoRep.primer_nombre,
                segundo_nombre: datoRep.segundo_nombre,
                primer_apellido: datoRep.primer_apellido,
                segundo_apellido: datoRep.segundo_apellido,
                comuna_rep: idcomuna2,
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
            console.log('ESTO ES LO QUE GUARDA EL REP2', RepVec)
            return res.json({ msg: 'yes' });
        }
    }
    catch (error) {
        console.log('hay un error')
    }
};

export const cantRep = async (req: Request, res: Response) => {
    const id = req.params.id_junta;
    try {
        const { count, rows } = await RepresentanteVecinal.findAndCountAll({ where: { fk_id_junta_vecinal: id } });
        if (!count) {
            return res.json({ status: 400, respuesta: 'no se encontraron datos' });
        }
        return res.json({ status: 200, respuesta: count });
    }
    catch (error) {
        return res.json({ status: 404, respuesta: error });
    }
};   


export const getRep = async (req: Request, res: Response) => {
    const id = req.params.idJuntaVec;
    console.log('id de la junta vecinal', id)
  try {
    // Obtiene todos los vecinos de la base de datos con evidencia igual a true (1)
    const listRepresentantes = await RepresentanteVecinal.findAll({
      where: {
        fk_id_junta_vecinal: id
      },
    });
    return res.json({ listRepresentantes });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: 'Error al obtener los Representantes Vecinales'
    });
  }
}

export const updatereprese = async (req: Request, res: Response) => {
  // Obtiene el valor del parámetro rut_vecino de la solicitud
  const { rut_representante } = req.params;

  // Obtiene los datos del cuerpo de la solicitud
  const {
    primer_nombre,
    segundo_nombre,
    primer_apellido,
    segundo_apellido,
    direccion,
    numero,
    correo_electronico,
    telefono,
    contrasenia
  } = req.body;

  let hashpasword: string;
  // Busca el vecino en la base de datos
  const repre: any = await RepresentanteVecinal.findOne({ where: { rut_representante: rut_representante } });

  if (contrasenia === repre.contrasenia) {
    // La contraseña ya está encriptada, utiliza la misma contraseña encriptada
    hashpasword = repre.contrasenia;
  } else {
    // La contraseña no está encriptada, encripta la contraseña
    hashpasword = await bcrypt.hash(contrasenia, 10);

  }
  // Actualiza los datos del vecino en la base de datos
  const result = await RepresentanteVecinal.update(
    {
      primer_nombre,
      segundo_nombre,
      primer_apellido,
      segundo_apellido,
      direccion,
      numero,
      correo_electronico,
      telefono,
      contrasenia: hashpasword
    },
    {
      where: {
        rut_representante
      }
    }
  );

  if (result[0] > 0) {
    return res.json({
      msg: 'representante actualizado correctamente'
    });
  }

  return res.json({
    msg: 'No se encontró el representate a actualizar'
  });
}