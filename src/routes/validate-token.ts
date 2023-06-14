import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const validatetoken = (req: Request, res: Response, next: NextFunction) => {
    //creando variable para el token con su respectivo header osea clave
    const headrtoken = req.headers['authorization'];
    //vereficamos con log si tiene token
    console.log(headrtoken);
    //verificamos si tiene token y que no sea undefined
    if (typeof headrtoken !== undefined && headrtoken?.startsWith('Bearer')) {
        //tiene token
        try {
            //creamos una variable para el token y le quitamos el bearer
            const Bearertoken = headrtoken.slice(7);
            //verificamos el token con la clave secreta
            jwt.verify(Bearertoken, process.env.SECRET_KEY || "secretkey")
            next();

        } catch (error) { //capturamos error y mostramos qye no esta autorizado 
            res.status(403).json({
                msg: 'no autorizado'
            });

        }
    } else {
        res.status(403).json({
            msg: 'no autorizado'
        })
    }

}
//exportamos la funcion
export default validatetoken;