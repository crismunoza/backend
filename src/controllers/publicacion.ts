import { Request, Response } from "express";
import { convertToLowerCase, deleteSpace, formatDate, parserUpperWord } from "../services/parser";
import { decodeBase64Image } from "../utils/imageUtils";
import path from "path";
import fs from "fs";
import { getMaxId, getPublication, queries, storageProcedure } from '../models/queries';
import { SQLTableNameValues } from "../types/sqlTypes";
import { Actividad, RepresentanteVecinal } from "../models/mer";

class Publicacion {
    private readonly modelName: string;
    constructor(){
        this.modelName = SQLTableNameValues.actividad;
    }
    
    insertPublication = async (req: Request, res: Response) => {
        try {
            const {nombre, descripcion, imagen, fecha_actividad, rut_user} = req.body;
            
            const Representante = await RepresentanteVecinal.findAll({
                where: {rut_representante: rut_user},
                attributes: ['id_representante_vecinal']
            });

            const count = await Actividad.count({
                where: { fk_id_representante_vecinal: Representante[0].dataValues.id_representante_vecinal }
            });
            
            if (count < 3) {
                const typeProcess = 0;
                const formattedNombrePublicacion = parserUpperWord(nombre);
                const formattedNombrePublicacionSinEspacio = deleteSpace(nombre);
                const formattedDescripcion = parserUpperWord(descripcion);
                const formattedImagen = deleteSpace(imagen);
                const formattedDate = formatDate(fecha_actividad);
                //**guardado de imagen */
                const imageBuffer = decodeBase64Image(formattedImagen);
                const nombreImagen = deleteSpace(nombre);
                const nombreImagenFormmated = convertToLowerCase(nombreImagen);
                const imageName = `${nombreImagenFormmated}.png`;
                const imageFolder = path.join(__dirname, "../../public/images/publicacion");
                const imagePath = path.join(imageFolder, imageName);
                if (!fs.existsSync(imagePath)) {
                if (!fs.existsSync(imageFolder)) {
                    fs.mkdirSync(imageFolder, { recursive: true });
                }
                fs.writeFileSync(imagePath, imageBuffer);
                } else {
                console.log('La imagen ya existe en la carpeta de proyectos');
                }

                const imageUrl = imageName;
                const maxId = await getMaxId(this.modelName,'id_actividad');

                const insertPublicationResult = await storageProcedure(
                    maxId,
                    formattedNombrePublicacion,
                    formattedDescripcion,
                    imageUrl,
                    formattedDate,
                    Representante[0].dataValues.id_representante_vecinal,
                    typeProcess
                );

              return res.status(200).json({resp:insertPublicationResult});
            }else {
                return res.status(500).json({ resp: "Has excedido el límite de publicaciones agregadas (3)", error: '0' })
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json({ resp: "Error al recibir los datos", error: '1' })
        }
    };

    getPublication = async (req: Request, res: Response) => {
        try {
          const publications = await getPublication(parseInt(req.params.idJuntaVecinal));
          console.log(publications)
          return res.status(200).json(publications);
        } catch (error) {
          console.error(error);
          return res.status(500).json({ resp: "Error al obtener las publicaciones", error: '0' });
        }
      };

    updatePublication = async (req: Request, res: Response) => {
        try {
            const {id_actividad, nombre, descripcion, imagen, fecha_actividad, rut_user} = req.body;
            const typeProcess = 1;
            const formattedNombrePublicacion = parserUpperWord(nombre);
            const formattedNombrePublicacionSinEspacio = deleteSpace(nombre);
            const formattedDescripcion = parserUpperWord(descripcion);
            const formattedImagen = deleteSpace(imagen);
            const formattedDate = formatDate(fecha_actividad);
            //**guardado de imagen */
            const imageBuffer = decodeBase64Image(formattedImagen);
            const nombreImagen = deleteSpace(nombre);
            const nombreImagenFormmated = convertToLowerCase(nombreImagen);
            const imageName = `${nombreImagenFormmated}.png`;
            const imageFolder = path.join(__dirname, "../../public/images/publicacion");
            const imagePath = path.join(imageFolder, imageName);
            if (!fs.existsSync(imagePath)) {
            if (!fs.existsSync(imageFolder)) {
                fs.mkdirSync(imageFolder, { recursive: true });
            }
            fs.writeFileSync(imagePath, imageBuffer);
            } else {
            console.log('La imagen ya existe en la carpeta de proyectos');
            }

            const imageUrl = imageName;
            
            const Representante = await RepresentanteVecinal.findAll({
                where: {rut_representante: rut_user},
                attributes: ['id_representante_vecinal']
            })
                const insertPublicationResult = await storageProcedure(
                    id_actividad,
                    formattedNombrePublicacion,
                    formattedDescripcion,
                    imageUrl,
                    formattedDate,
                    Representante[0].dataValues.id_representante_vecinal,
                    typeProcess
                );

              return res.status(200).json({resp:insertPublicationResult});
            
        } catch (error) {
            console.log(error);
            return res.status(500).json({ resp: "Error al actualizar la publicación", error: '0' }); 
        }
    }

    // vercontacto = async (req: Request, res: Response) => {
    //     const { id_junta_vecinal } = req.params;
    //     try {
    //       const query = `
    //       SELECT 
    //         "comuna"."nombre",
    //         "junta_vecinal"."direccion",
    //         "junta_vecinal"."numero_calle",
    //         "junta_vecinal"."rut_junta",
    //         "junta_vecinal"."razon_social",
    //         "representante_vecinal"."primer_nombre",
    //         "representante_vecinal"."segundo_nombre",
    //         "representante_vecinal"."primer_apellido",
    //         "representante_vecinal"."segundo_apellido",
    //         "representante_vecinal"."correo_electronico",
    //         "representante_vecinal"."telefono"
    //         FROM "comuna"
    //         INNER JOIN "junta_vecinal" ON "comuna"."id_comuna" = "junta_vecinal"."fk_id_comuna"
    //         INNER JOIN "representante_vecinal" ON "junta_vecinal"."id_junta_vecinal" = "representante_vecinal"."fk_id_junta_vecinal"
    //         WHERE "junta_vecinal"."id_junta_vecinal" = :id_junta_vecinal;
    //         `;
    
    //     const vercontacto = await db.query(query, {
    //       replacements: { id_junta_vecinal },
    //       type: QueryTypes.SELECT,
    //     });
          
    //       res.json({
    //         data: vercontacto,
    //       });
    //     } catch (e) {
    //       console.log(e);
    //     }
    //   };

}

const publicacionController = new Publicacion

export default publicacionController;