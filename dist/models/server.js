"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const comentarios_1 = __importDefault(require("../routes/comentarios"));
const login_1 = __importDefault(require("../routes/login"));
const resetpass_1 = __importDefault(require("../routes/resetpass"));
const comunas_1 = __importDefault(require("../routes/comunas"));
const vecinos_1 = __importDefault(require("../routes/vecinos"));
// import routamunicipalidad from "../routes/municipalidad"
const juntavecinal_1 = __importDefault(require("../routes/juntavecinal"));
const certificados_1 = __importDefault(require("../routes/certificados"));
const proyecto_1 = __importDefault(require("../routes/proyecto"));
const exists_1 = require("./exists");
class Server {
    //constructor de la clase server y se inicializan los metodos
    constructor() {
        //creamos las variables
        this.app = (0, express_1.default)();
        this.port = process.env.PORT || '3001';
        this.listen(); //llamamos al metodo listen
        this.middlewares(); //llamamos al metodo middlewares
        this.routas(); //llamamos al metodo routesComentarios
        this.conectarDB(); //llamamos al metodo conectarDB
    }
    //metodo para el puerto para que se ejecute el servidor
    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });
    }
    //metodo para las rutas para llevar mandar a llamar las rutas en angular
    routas() {
        this.app.use('/api/comen', comentarios_1.default);
        this.app.use('/api/users', login_1.default);
        this.app.use('/api/reset', resetpass_1.default);
        this.app.use('/api/comunas', comunas_1.default);
        // this.app.use('/api/municipalidades', routamunicipalidad);
        this.app.use('/api/juntavecinal', juntavecinal_1.default);
        this.app.use('/api/insertvecino', vecinos_1.default);
        this.app.use('/api/proyectos', proyecto_1.default);
        this.app.use('/api/certificados', certificados_1.default);
    }
    middlewares() {
        //parseo y lectura del body
        this.app.use(express_1.default.json());
        //directorio publico
        this.app.use((0, cors_1.default)());
    }
    //metodo para conectar a la base de datos y sincronizar los modelos
    conectarDB() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, exists_1.verificarTablas)()
                    .then(() => {
                    console.log("La verificación de tablas ha sido completada.");
                })
                    .catch((error) => {
                    console.error(`Ha ocurrido un error: ${error}`);
                });
            }
            catch (error) {
                console.log("No se puede conectar a base de datos", error);
            }
        });
    }
}
exports.Server = Server;
exports.default = Server;
