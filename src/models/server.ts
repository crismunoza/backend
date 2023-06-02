import  Express  from "express";
import cors from "cors";
import routascomen from "../routes/comentarios";
import routauser from "../routes/login";
import routareset from "../routes/resetpass";
import routacomuna from "../routes/comunas";
import routavecino from "../routes/vecinos";
// import routamunicipalidad from "../routes/municipalidad"
import routajunta from "../routes/juntavecinal"
import routacertificado from "../routes/certificados"
import routaproyecto from "../routes/proyecto"
import routasolicitud from "../routes/solicitud"

import rutavaloraciones from "../routes/valoraciones"

import { verificarTablas } from "./exists";



export class Server {
    // declaracion de variables
    private app: Express.Application;
    private port: string;
    //constructor de la clase server y se inicializan los metodos
  constructor() { 
    //creamos las variables
    this.app = Express();
    this.port = process.env.PORT || '3001';
    this.listen();//llamamos al metodo listen
    this.middlewares();//llamamos al metodo middlewares
    this.routas();//llamamos al metodo routesComentarios
    this.conectarDB();//llamamos al metodo conectarDB
  }
  //metodo para el puerto para que se ejecute el servidor
    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });
    }
    //metodo para las rutas para llevar mandar a llamar las rutas en angular
    routas() {
        this.app.use('/api/comen', routascomen);
        this.app.use('/api/users', routauser);
        this.app.use('/api/reset', routareset);
        this.app.use('/api/comunas', routacomuna);
        this.app.use('/api/juntavecinal', routajunta);
        this.app.use('/api/insertvecino', routavecino);
        this.app.use('/api/proyectos', routaproyecto);
        this.app.use('/api/certificados', routacertificado);
        this.app.use('/api/solicitudes', routasolicitud);
        this.app.use('/api/valoraciones', rutavaloraciones);

    }
    middlewares() {
        this.app.use(Express.json({ limit: '10mb' }));
        this.app.use(cors());
        this.app.use(Express.urlencoded({ limit: '10mb', extended: true }));
    }
    //metodo para conectar a la base de datos y sincronizar los modelos
    async conectarDB() {
        
        try {

            verificarTablas()
            .then(() => {
                console.log("La verificación de tablas ha sido completada.");
            })
            .catch((error) => {
                console.error(`Ha ocurrido un error: ${error}`);
            });
            
        } catch (error) {
            console.log("No se puede conectar a base de datos",error);
        }
    }
}

export default Server;