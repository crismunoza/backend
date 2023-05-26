"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usuario = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
//creacion de el modelo de la tabla usuarios para la base de datos
exports.usuario = connection_1.default.define('usuarios', {
    id_usuarios: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    correo: {
        type: sequelize_1.DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    contrasena: {
        type: sequelize_1.DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
}, {
    // Evita que se cree los campos createdAt y updatedAt que sequelize crea por defecto
    //y son de tablas de tiempo de creacion y actualizacion
    createdAt: false,
    timestamps: false,
});
