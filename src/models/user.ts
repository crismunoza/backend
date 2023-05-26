import { DataTypes } from "sequelize";
import sequelize from "../db/connection";
//creacion de el modelo de la tabla usuarios para la base de datos
export const usuario = sequelize.define('usuarios', {
    id_usuarios: { 
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    correo: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    contrasena: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    },
    {
        // Evita que se cree los campos createdAt y updatedAt que sequelize crea por defecto
        //y son de tablas de tiempo de creacion y actualizacion
        createdAt: false,
        timestamps: false,
});

