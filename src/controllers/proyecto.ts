import { Request, Response } from 'express';
import { JuntaVecinal, Proyecto, Reporte, RepresentanteVecinal, Vecino } from '../models/mer';
import { ProyectoType } from '../types/types';
import { getMaxId, getProyects } from '../models/queries';
import { SQLTableNameValues, SQLTableProyect } from '../types/sqlTypes';
import { convertToLowerCase, convertUpperCASE, covertFirstCapitalLetterWithSpace, deleteSpace, formatDate, parserUpperWord } from '../services/parser'
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
        const nombreImagenFormmated = convertToLowerCase(nombreImagen);
        const imageName = `${nombreImagenFormmated}.png`;
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
      const proyects = await getProyects(parseInt(req.params.idJuntaVecinal));
      return res.status(200).json(proyects);
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
    
    const proyecto = await Proyecto.findAll({
      where: {id_proyecto: id_proyecto},
      attributes: ['nombre', 'descripcion', 'cupo_min', 'cupo_max', 'estado', 'fecha_proyecto'],
      include: [
        {
          model: JuntaVecinal,
          attributes: ['razon_social'],
          include: [
            {
              model: Vecino,
              attributes: ['rut_vecino', 'primer_nombre', 'segundo_nombre', 'primer_apellido', 'segundo_apellido', 'direccion', 'correo_electronico', 'telefono']
            }
          ]
        }
      ]
    });
    console.log(proyecto)
    const nameJuntaVecinalFormmated = covertFirstCapitalLetterWithSpace(proyecto[0].dataValues.JuntaVecinal.razon_social);
    
    if (!proyecto) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }
    const count = await Reporte.count({
      where:{
      fk_id_proyecto: id_proyecto,
      inscrito: 'SI'}
    });
    
    const proyectoEnReportes = await Reporte.findOne({
      where: {
        fk_id_proyecto: id_proyecto
      },
      attributes: ['inscrito']
    });

    const nameExcel = deleteSpace(proyecto[0].dataValues.nombre);
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`proyecto-${nameExcel}`);    
    //se agregan los datos del proyecto a las celdas
    worksheet.getCell('A1').value = 'Junta Vecinal';
    worksheet.getCell('A1').style = {
      font: {
        bold: true
      }
    };
    worksheet.getCell('A2').value = nameJuntaVecinalFormmated;

    worksheet.getCell('B1').value = 'Nombre Proyecto';
    worksheet.getCell('B1').style = {
      font: {
        bold: true
      }
    };
    worksheet.getCell('B2').value = proyecto[0].dataValues.nombre;
    
    worksheet.getCell('C1').value = 'Descripción';
    worksheet.getCell('C1').style = {
      font: {
        bold: true
      }
    };
    worksheet.getCell('C2').value = proyecto[0].dataValues.descripcion;

    worksheet.getCell('D1').value = 'Cupo Mínimo';
    worksheet.getCell('D1').style = {
      font: {
        bold: true
      }
    };
    worksheet.getCell('D2').value = proyecto[0].dataValues.cupo_min;
    worksheet.getCell(`D2`).style = {
      alignment: {
        horizontal: 'center'
      }
    };

    worksheet.getCell('E1').value = 'Cupo Máximo';
    worksheet.getCell('E1').style = {
      font: {
        bold: true
      }
    };
    worksheet.getCell('E2').value = proyecto[0].dataValues.cupo_max;
    worksheet.getCell(`E2`).style = {
      alignment: {
        horizontal: 'center'
      }
    };

    worksheet.getCell('F1').value = 'Total Inscritos';
    worksheet.getCell('F1').style = {
      font: {
        bold: true
      }
    };
    worksheet.getCell('F2').value = count;
    worksheet.getCell(`F2`).style = {
      alignment: {
        horizontal: 'center'
      }
    };
    
    worksheet.getCell('G1').value = 'Estado';
    worksheet.getCell('G1').style = {
      font: {
        bold: true
      }
    };
    worksheet.getCell('G2').value = proyecto[0].dataValues.estado;

    worksheet.getCell('H1').value = 'Fecha Proyecto';
    worksheet.getCell('H1').style = {
      font: {
        bold: true
      }
    };
    worksheet.getCell('H2').value = proyecto[0].dataValues.fecha_proyecto;
    //data neighbor.
    if (proyectoEnReportes) {
      const vecinosStartRow = 5;
  
      // Encabezados
      worksheet.getCell(`A${vecinosStartRow}`).value = 'Rut Vecino';
      worksheet.getCell(`A${vecinosStartRow}`).style = {
        font: {
          bold: true
        }
      };
      worksheet.getCell(`B${vecinosStartRow}`).value = 'Nombre Vecino';
      worksheet.getCell(`B${vecinosStartRow}`).style = {
        font: {
          bold: true
        }
      };
      worksheet.getCell(`C${vecinosStartRow}`).value = 'Dirección';
      worksheet.getCell(`C${vecinosStartRow}`).style = {
        font: {
          bold: true
        }
      };
      worksheet.getCell(`D${vecinosStartRow}`).value = 'Correo Electrónico';
      worksheet.getCell(`D${vecinosStartRow}`).style = {
        font: {
          bold: true
        }
      };
      worksheet.getCell(`E${vecinosStartRow}`).value = 'Teléfono';
      worksheet.getCell(`E${vecinosStartRow}`).style = {
        font: {
          bold: true
        }
      };
      worksheet.getCell(`F${vecinosStartRow}`).value = 'Vecino Inscrito';
      worksheet.getCell(`F${vecinosStartRow}`).style = {
        font: {
          bold: true
        }
      };
      
      // Datos de los vecinos
      const vecinos = proyecto[0].dataValues.JuntaVecinal.Vecinos;
      vecinos.forEach((vecino: any, index: any) => {
        const row = vecinosStartRow + index + 1; // Sumar 1 para evitar sobrescribir los encabezados
        const fullNameNeighbor = covertFirstCapitalLetterWithSpace(vecino.primer_nombre + ' ' + vecino.segundo_nombre + ' ' + vecino.primer_apellido + ' ' + vecino.segundo_apellido);
        const addressNeighbor = covertFirstCapitalLetterWithSpace(vecino.direccion);

        worksheet.getCell(`A${row}`).value = vecino.rut_vecino;
        worksheet.getCell(`B${row}`).value = fullNameNeighbor;
        worksheet.getCell(`C${row}`).value = addressNeighbor;
        worksheet.getCell(`D${row}`).value = vecino.correo_electronico;
        worksheet.getCell(`E${row}`).value = vecino.telefono;
        worksheet.getCell(`F${row}`).value = proyectoEnReportes.dataValues.inscrito;
        worksheet.getCell(`F${row}`).style = {
          alignment: {
            horizontal: 'center'
          }
        };
      });
      
    }

    worksheet.columns.forEach((column) => {
      column.width = 28;
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
  };

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

}    
const proyectoController = new ProyectoController();

export default proyectoController;