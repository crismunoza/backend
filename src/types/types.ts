import { JuntaVecinal } from '../models/mer';
export type ProyectoType = {
    id_proyecto: number;
    nombre: string;
    descripcion: string;
    cupo_min: number;
    cupo_max: number;
    estado: string;
    ruta_imagen: string;
    fecha_proyecto: string;
    fk_id_junta_vecinal: number;
    juntaVecinal?: typeof JuntaVecinal;
}