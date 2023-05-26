import { Request, Response } from 'express';
import { Comuna } from '../models/mer';

export const getComunas = async (req: Request, res: Response) => {
    //se traen todas las comunas.
    const listComunas = await Comuna.findAll();
    // //retornamos las comunas en formato json
    res.json({ listComunas });
};