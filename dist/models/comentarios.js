"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comentarios = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
//creacion de el modelo de la tabla comentarios para la base de datos
exports.comentarios = connection_1.default.define('comentarios', {
    id_comentario: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombres: {
        type: sequelize_1.DataTypes.STRING
    },
    descripciones: {
        type: sequelize_1.DataTypes.STRING
    },
}, {
    // Evita que se cree los campos createdAt y updatedAt que sequelize crea por defecto
    //y son de tablas de tiempo de creacion y actualizacion
    createdAt: false,
    timestamps: false,
    freezeTableName: true,
});
