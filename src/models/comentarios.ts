import { DataTypes } from "sequelize";
import sequelize from "../db/connection";
//creacion de el modelo de la tabla comentarios para la base de datos
export const comentarios = sequelize.define('comentarios', {
    id_comentario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombres: {
        type: DataTypes.STRING
    },
    descripciones: {
        type: DataTypes.STRING
    },
    },{
        // Evita que se cree los campos createdAt y updatedAt que sequelize crea por defecto
        //y son de tablas de tiempo de creacion y actualizacion
        createdAt: false,
        timestamps: false,
        freezeTableName: true,
    });
    