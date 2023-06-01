import { Request, Response } from 'express';
export const enviarSolicitud = async (req: Request, res: Response) => {
    const {opinion,estrellas} = req.body;
};