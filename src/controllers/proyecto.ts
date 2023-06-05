import { Request, Response } from 'express';
import { Proyecto, RepresentanteVecinal } from '../models/mer';
import { ProyectoType } from '../types/types';
import { getMaxId } from '../models/queries';
import { SQLTableNameValues, SQLTableProyect } from '../types/sqlTypes';
import { convertUpperCASE, deleteSpace, formatDate, parserUpperWord } from '../services/parser'
import { decodeBase64Image } from "../utils/imageUtils";
import path from "path";
import fs from "fs";


class ProyectoController {
  private readonly modelName: string;
  private readonly estatApply: string;
  constructor() {
    this.modelName = SQLTableNameValues.proyecto;
    this.estatApply = SQLTableProyect.estado;
  }
  insertProyect = async (req: Request, res: Response) => {
    try {
        let fk_id_junta_vecinal;
        const { nombreProyecto, cupoMinimo, cupoMaximo, descripcion, fecha, imagen, rut_user, image } = req.body;
        //se asigna el valor activo al estado, ya que se está insertando el proyecto.
        const estado = this.estatApply; 
        //obtención max id a ingresar.
        const maxId = await getMaxId(this.modelName,'id_proyecto');
        //se formatea la fecha.
        const formattedDate = formatDate(req.body.fecha);
        //eliminación de espacios en la ruta de la imagen.
        const formattedImagen = deleteSpace(imagen);
        const formattedNombreProyecto = parserUpperWord(nombreProyecto);
        const formattedDescripcion = parserUpperWord(descripcion);
        //obtención de fk_id_junta_vecinal por el rut del representante.
        const representante_fk_id_junta_vecinal = await RepresentanteVecinal.findOne({
          where: { rut_representante: rut_user },
          attributes: ['fk_id_junta_vecinal']
        });
        if(representante_fk_id_junta_vecinal){
          fk_id_junta_vecinal = representante_fk_id_junta_vecinal.dataValues['fk_id_junta_vecinal']
        }
        //**guardado de imagen */
        const imageBuffer = decodeBase64Image(image);
        const nombreImagen = deleteSpace(nombreProyecto);
        const imageName = `${nombreImagen}.png`;
        const imageFolder = path.join(__dirname, "../../public/images/proyectos");
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
        //crea el objeto de datos del proyecto de tipo ProyectoType.
        const proyectoData: ProyectoType = {
          id_proyecto: maxId,
          nombre: formattedNombreProyecto,
          descripcion: formattedDescripcion,
          cupo_min: cupoMinimo,
          cupo_max: cupoMaximo,
          estado,
          ruta_imagen: imageUrl,
          fecha_proyecto: formattedDate,
          fk_id_junta_vecinal: fk_id_junta_vecinal
        };
        //inserción del proyecto.
        const proyecto = await Proyecto.create(proyectoData);
        //response.
        return res.json({resp: "Proyecto insertado exitosamente"});
      } catch (error) {
        //control nombre mensaje error.
        const errorMessage = (error as any)?.parent?.message || (error as any)?.message;
        console.log(errorMessage);
        if (errorMessage === "ORA-00001: restricción única (C##JUNTA_VECINAL.proyecto_nombre_unique) violada") {
          // return res.send("El nombre del proyecto ya existe");
          return res.status(400).json({ resp: "El nombre del proyecto ya existe", error: '0' });
        } else {
          if (errorMessage === "ORA-00001: restricción única (C##JUNTA_VECINAL.proyecto_descripcion_unique) violada"){
            return res.status(400).json({ resp: "La descripción ya existe", error: '1' });
          } else {
            return res.status(400).json({ resp: "Error al insertar el proyecto", error: '-1' });
          }
        } 
      }
  }

  getProyects = async (req: Request, res: Response) => {
    try {
      const allProyects = await Proyecto.findAll();
      return res.status(200).json(allProyects);
    } catch (error) {
      return res.status(500).json({ resp: "Error al obtener los proyectos", error: '0' });
    }
  };
  getProyectsWithFilters = async (req: Request, res: Response) => {
    try {
      let proyects;
      const filtro = req.body; 
      if (filtro.estado.includes('TODOS')) {
        proyects = await Proyecto.findAll();
        
      } else {
        proyects = await Proyecto.findAll({
          where: {
            estado: filtro.estado
          }
        });
      }
      return res.status(200).json(proyects);
    } catch (error) {
      return res.status(500).json({ resp: "Error al obtener los proyectos", error: '0' });
    }
  };
    
  getFilters = async (req: Request, res: Response) => {
    try {
      const estados = await Proyecto.findAll({
        attributes: ['estado'],
        group: ['estado']
      });
      const filtros = ['TODOS', ...estados.map((estado: any) => estado.estado)];
      return res.status(200).json(filtros);
    } catch (error) {
      return res.status(500).json({ resp: "Error al obtener los filtros", error: '0' });
    }
  };

  updateProyect = async (req: Request, res: Response) => {
    try {
      const { id_proyecto, nombre, cupo_min, cupo_max, descripcion, estado } = req.body;
      const convertEstatus = convertUpperCASE(req.body.estado);

      if (convertEstatus !== 'ACTIVO' && convertEstatus !== 'CERRADO'){
        return res.status(400).json({ resp: 'El estado debe ser ACTIVO o CERRADO', error: '0' });
      }
        await Proyecto.update(
          { nombre, cupo_min, cupo_max, descripcion, estado: convertEstatus },
          { where: { id_proyecto } }
        );
        return res.status(200).json({resp: 'Información modificada exitosamente'});
    } catch (error) {
      return res.status(500).json({ resp: "Error al modificar la información", error: '1' });
    }
  };

  deleteProyect = async (req: Request, res: Response) => {
    try {
      const id_proyecto = req.params.idProyecto;
      
      await Proyecto.destroy({where: {id_proyecto}});
      return res.status(200).json({resp: 'Proyecto eliminado exitosamente'});
    } catch (error) {
      console.log(error)
      return res.status(500).json({ resp: "Error al eliminar el proyecto", error: '0' });
    }

  };

  getImagenes = async (req: Request, res: Response) => {
    try {
      const imageName = req.query.imageName as string;
      const imagePath = path.join(__dirname, '../../public/proyectos', imageName);

      res.sendFile(imagePath);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener la imagen' });
    }
  };
}  
const proyectoController = new ProyectoController();

export default proyectoController;