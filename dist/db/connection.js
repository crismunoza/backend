"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// importando sequelize para conectar con la base de datos
const sequelize_1 = require("sequelize");
// haciendo la conexion con la base de datos mediante sequelize
const db = new sequelize_1.Sequelize({
    dialect: 'oracle',
    username: "c##junta_vecinal",
    password: '123',
    database: 'portafolio',
    dialectOptions: { connectString: '(DESCRIPTION=(ADDRESS = (PROTOCOL = TCP)(HOST = NBR-CMUNOZ)(PORT = 1521))(CONNECT_DATA =(SERVER=DEDICATED)(SERVICE_NAME = XE)))' }
});
//el dialectoptions es para que se conecte a la base de datos de oracle y 
//se trae del tnsnames.ora pegar el suyo
// exportando la conexion
exports.default = db;
