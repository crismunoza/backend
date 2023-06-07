import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { Vecino, RepresentanteVecinal } from "../models/mer";

//metodo para cambiar contraseña

export const verificarRut = async (req: Request, res: Response) => {
    const { rut } = req.params;
    try {
        const verificarVecino = await Vecino.findOne({ where: { rut_vecino: rut } });
        const verificarRepresentante = await RepresentanteVecinal.findOne({ where: { rut_representante: rut } });

        if (verificarVecino || verificarRepresentante) {
            res.json({
                msg: `ok`
            });
        } else {
            res.json({
                msg: `no esta`
            });
        }
    } catch (error) {
        console.log(error);
        res.json({
            msg: `Ups ocurrió un error, comuníquese con soporte`
        });
    }
};


export const verificarCorreo = async (req: Request, res: Response) => {
    const { correo_electronico } = req.params;
    // console.log('ESTO ES EL BACKEND',correo)
    try {
        const verificar = await Vecino.findOne({ where: { correo_electronico } });
        const verificarRepresentante = await RepresentanteVecinal.findOne({ where: { correo_electronico} });

        if (verificar || verificarRepresentante) {
            res.json({
                msg: `ok correo`
            });
        } else {
            res.json({
                msg: `no esta el correo`
            });
        }
    } catch (error) {
        console.log(error);
        res.json({
            msg: `Upps ocurrio un error, comuniquese con soporte`
        });
    }
};


export const cambiarContrasena = async (req: Request, res: Response) => {
    const { rut, contrasenia } = req.body;

    try {
        const verificarVecino = await Vecino.findOne({ where: { rut_vecino: rut } });
        const verificarRepresentante = await RepresentanteVecinal.findOne({ where: { rut_representante: rut } });
        if (verificarVecino) {
            const hashPassword = await bcrypt.hash(contrasenia, 10);
            await verificarVecino.update({ contrasenia: hashPassword });
            res.json({
                msg: 'Se actualizó la contraseña exitosamente'
            });
        } else if (verificarRepresentante) {
            const hashPassword = await bcrypt.hash(contrasenia, 10);
            await verificarRepresentante.update({ contrasenia: hashPassword });
            res.json({
                msg: 'Se actualizó la contraseña exitosamente'
            });
        } else {
            res.json({
                msg: `Error al actualizar la contraseña`
            });
        }
    } catch (error) {
        console.log(error);
        res.json({
            msg: `Ups ocurrió un error, comuníquese con soporte`
        });
    }
};

