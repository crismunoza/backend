import { Request, Response } from 'express';
import { Proyecto } from '../models/mer';
import { ProyectoType } from '../types/types';
import { getMaxId } from '../models/queries';
import { SQLTableNameValues } from '../types/sqlTypes';


class ProyectoController {
  private readonly modelName: string;
  constructor() {
    this.modelName = SQLTableNameValues.proyecto;
  }
  insertProyect = async (req: Request, res: Response) => {
    try {
        const { nombreProyecto, cupoMinimo, cupoMaximo, descripcion, fecha, imagen, fk_id_junta_vecinal } = req.body;
        //se asigna el valor activo al estado, ya que se está insertando el proyecto.
        const estado = 'Activo'; 
        //obtención max id a ingresar.
        const maxId = await getMaxId(this.modelName,'id_proyecto');
        //crea el objeto de datos del proyecto de tipo ProyectoType.
        const proyectoData: ProyectoType = {
          id_proyecto: maxId,
          nombre: nombreProyecto,
          descripcion,
          cupo_min: cupoMinimo,
          cupo_max: cupoMaximo,
          estado,
          ruta_imagen: imagen,
          fecha_proyecto: fecha,
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
}
const proyectoController = new ProyectoController();

export default proyectoController;