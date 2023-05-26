"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validatetoken = (req, res, next) => {
    //creando variable para el token con su respectivo header osea clave
    const headrtoken = req.headers['authorization'];
    //vereficamos con log si tiene token
    console.log(headrtoken);
    //verificamos si tiene token y que no sea undefined
    if (typeof headrtoken !== undefined && (headrtoken === null || headrtoken === void 0 ? void 0 : headrtoken.startsWith('Bearer'))) {
        //tiene token
        try {
            //creamos una variable para el token y le quitamos el bearer
            const Bearertoken = headrtoken.slice(7);
            //verificamos el token con la clave secreta
            jsonwebtoken_1.default.verify(Bearertoken, process.env.SECRET_KEY || "secretkey");
            next();
        }
        catch (error) { //capturamos error y mostramos qye no esta autorizado 
            res.status(403).json({
                msg: 'no autorizado'
            });
        }
    }
    else {
        res.status(403).json({
            msg: 'no autorizado'
        });
    }
};
//exportamos la funcion
exports.default = validatetoken;
