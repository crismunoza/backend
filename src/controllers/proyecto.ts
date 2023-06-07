import { Request, Response } from 'express';
import { Proyecto, Reporte, RepresentanteVecinal } from '../models/mer';
import { ProyectoType } from '../types/types';
import { getMaxId } from '../models/queries';
import { SQLTableNameValues, SQLTableProyect } from '../types/sqlTypes';
import { convertUpperCASE, deleteSpace, formatDate, parserUpperWord } from '../services/parser'
import { decodeBase64Image } from "../utils/imageUtils";
import path from "path";
import fs from "fs";
import * as ExcelJS from 'exceljs';


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

  generateExcel = async (req: Request, res: Response) => {
    const { id_proyecto } = req.params;
    
    const proyecto = await Proyecto.findByPk(id_proyecto);

    if (!proyecto) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }
    const count = await Reporte.count({
      where:{
      fk_id_proyecto: id_proyecto,
      inscrito: 'SI'}
    });
    
    const nameExcel = deleteSpace(proyecto.dataValues.nombre);
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`proyecto-${nameExcel}`);
    
    //se agregan los datos del proyecto a las celdas
    worksheet.getCell('A1').value = 'ID Proyecto';
    worksheet.getCell('A1').style = {
      font: {
        bold: true
      }
    };
    worksheet.getCell('A2').value = proyecto.dataValues.id_proyecto;
    worksheet.getCell('B1').value = 'Nombre Proyecto';
    worksheet.getCell('B1').style = {
      font: {
        bold: true
      }
    };
    worksheet.getCell('B2').value = proyecto.dataValues.nombre;
    worksheet.getCell('C1').value = 'Descripción';
    worksheet.getCell('C1').style = {
      font: {
        bold: true
      }
    };
    worksheet.getCell('C2').value = proyecto.dataValues.descripcion;
    worksheet.getCell('D1').value = 'Cupo Mínimo';
    worksheet.getCell('D1').style = {
      font: {
        bold: true
      }
    };
    worksheet.getCell('D2').value = proyecto.dataValues.cupo_min;
    worksheet.getCell('E1').value = 'Cupo Máximo';
    worksheet.getCell('E1').style = {
      font: {
        bold: true
      }
    };
    worksheet.getCell('E2').value = proyecto.dataValues.cupo_max;
    worksheet.getCell('F1').value = 'Inscritos';
    worksheet.getCell('F1').style = {
      font: {
        bold: true
      }
    };
    worksheet.getCell('F2').value = count;
    worksheet.getCell('G1').value = 'Estado';
    worksheet.getCell('G1').style = {
      font: {
        bold: true
      }
    };
    worksheet.getCell('G2').value = proyecto.dataValues.estado;
    worksheet.getCell('H1').value = 'Fecha Proyecto';
    worksheet.getCell('H1').style = {
      font: {
        bold: true
      }
    };
    worksheet.getCell('H2').value = proyecto.dataValues.fecha_proyecto;
    worksheet.columns.forEach((column) => {
      column.width = 20;
    });
    //configura el encabezado de la respuesta para indicar que es un archivo Excel.
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=proyecto-${nameExcel}.xlsx`);
    //envía el archivo Excel al frontend.
    workbook.xlsx.write(res)
      .then(() => res.end())
      .catch(error => {
        console.error('Error al generar el archivo Excel:', error);
        res.status(500).json({ error: 'Error al generar el archivo Excel' });
      });
  }

  getFiltersForModify = async (req: Request, res: Response) => {
    try {
      const existingEstados = await (await Proyecto.findAll({
        attributes: ['estado'],
        group: ['estado']
      })).map((estado: any) => estado.estado);
  
      const requiredEstados = ['ACTIVO', 'CERRADO'];
      const missingEstados = requiredEstados.filter(estado => !existingEstados.includes(estado));
      
      const estadosToSend = [...existingEstados, ...missingEstados];
        
      return res.status(200).json(estadosToSend);
    } catch (error) {
      return res.status(500).json({ resp: "Error al obtener los filtros para modificar el proyecto", error: '0' });
    }
  };
};  
const proyectoController = new ProyectoController();

export default proyectoController;