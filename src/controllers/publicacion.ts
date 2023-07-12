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
    constructor() {
        this.modelName = SQLTableNameValues.actividad;
    }

insertPublication = async (req: Request, res: Response) => {
  try {
    const { nombre, descripcion, imagen, rut_user } = req.body;

    const Representante = await RepresentanteVecinal.findAll({
      where: { rut_representante: rut_user },
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
      // Obtención de la fecha actual sin la hora.
      const currentDate = new Date();
      const formattedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()).toISOString().split('T')[0];
      // ** Guardado de imagen **
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
      const maxId = await getMaxId(this.modelName, 'id_actividad');

      const insertPublicationResult = await storageProcedure(
        maxId,
        formattedNombrePublicacion,
        formattedDescripcion,
        imageUrl,
        formattedDate,
        Representante[0].dataValues.id_representante_vecinal,
        typeProcess
      );

      return res.status(200).json({ resp: insertPublicationResult });
    } else {
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
    const { id_actividad, nombre, descripcion, imagen, rut_user } = req.body;
    const typeProcess = 1;
    const formattedNombrePublicacion = parserUpperWord(nombre);
    const formattedDescripcion = parserUpperWord(descripcion);
    const formattedImagen = deleteSpace(imagen);
    // Obtención de la fecha actual sin la hora.
    const currentDate = new Date();
    const formattedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()).toISOString().split('T')[0];
    // ** Guardado de imagen **
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
      where: { rut_representante: rut_user },
      attributes: ['id_representante_vecinal']
    });
    const insertPublicationResult = await storageProcedure(
      id_actividad,
      formattedNombrePublicacion,
      formattedDescripcion,
      imageUrl,
      formattedDate,
      Representante[0].dataValues.id_representante_vecinal,
      typeProcess
    );

    return res.status(200).json({ resp: insertPublicationResult });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ resp: "Error al actualizar la publicación", error: '0' });
  }
};

}
const publicacionController = new Publicacion
export default publicacionController;