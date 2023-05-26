import { Request, Response } from 'express';
import { comentarios } from '../models/comentarios';

//metodo para crear un comentario
export const getcomentarios = async (req: Request, res: Response) => {
    //creamos una constante para traer todos los comentarios con findAll
    const listcomentarios = await comentarios.findAll();
    //retornamos los comentarios en formato json
    res.json({listcomentarios });
};