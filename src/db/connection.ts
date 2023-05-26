// importando sequelize para conectar con la base de datos
import { Sequelize } from "sequelize";
// haciendo la conexion con la base de datos mediante sequelize
const db = new Sequelize({
    dialect: 'oracle',//el dialecto es el tipo de base de datos que se va a usar
    username: "c##junta_vecinal",//el usuario de la base de datos
    password: '123',//la contraseña de la base de datos
    database: 'portafolio',//el nombre de la base de datos
    dialectOptions: {connectString: '(DESCRIPTION=(ADDRESS = (PROTOCOL = TCP)(HOST = NBR-CMUNOZ)(PORT = 1521))(CONNECT_DATA =(SERVER=DEDICATED)(SERVICE_NAME = XE)))'}
    
});
//el dialectoptions es para que se conecte a la base de datos de oracle y 
//se trae del tnsnames.ora pegar el suyo




// exportando la conexion
export default db;