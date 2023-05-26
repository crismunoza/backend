import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { usuario } from '../models/user';

//metodo para cambiar contraseña

export const verificarCorreo = async (req: Request, res: Response) => {
    const { correo } = req.query;
    // console.log('ESTO ES EL BACKEND',correo)
    try {
        const verificar = await usuario.findOne({ where: { correo } });
        if (verificar ) {
            res.json({
                msg: `El correo ${correo} se encuentra registrado`
            });
        } else {
            res.status(400).json({
                msg: `No se encuentra registrado el correo ${correo}`
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
    const { correo, contrasena } = req.body;
    try {
        // console.log('ESTO ES EL BACKEND cambiarcontraseña',correo,contrasena)
        const verificar = await usuario.findOne({ where: { correo } });
        if (verificar) {
            const hashpasword = await bcrypt.hash(contrasena, 10);
            await verificar.update({ contrasena: hashpasword });
            res.json({
                msg: 'Se actualizo la contraseña exitosamente'
            });
        } else {
            res.status(400).json({
                msg: `No se encuentra registrado el correo ${correo}`
            });
        }
    } catch (error) {
        console.log(error);
        res.json({
            msg: `Upps ocurrio un error, comuniquese con soporte`
        });
    }
};
