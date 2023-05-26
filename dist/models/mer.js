"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Valoracion = exports.Solicitud = exports.Certificado = exports.Vecino = exports.Actividad = exports.RepresentanteVecinal = exports.Reporte = exports.Proyecto = exports.JuntaVecinal = exports.Comuna = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
exports.Comuna = connection_1.default.define('comuna', {
    id_comuna: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: sequelize_1.DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
}, {
    // Evita que se cree los campos createdAt y updatedAt que sequelize crea por defecto
    //y son de tablas de tiempo de creacion y actualizacion
    createdAt: false,
    timestamps: false,
    tableName: 'comuna'
});
// export const Municipalidad = sequelize.define('municipalidad', {
//     id_municipalidad: { 
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true
//     },
//     nombre: {
//         type: DataTypes.STRING,
//         unique: true,
//         allowNull: false,
//     },
//     },
//     {
//         createdAt: false,
//         timestamps: false,
//         tableName: 'municipalidad'
// });
exports.JuntaVecinal = connection_1.default.define('JuntaVecinal', {
    id_junta_vecinal: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    razon_social: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    direccion: {
        type: sequelize_1.DataTypes.STRING,
        unique: false,
        allowNull: false,
    },
    numero_calle: {
        type: sequelize_1.DataTypes.INTEGER,
        unique: false,
        allowNull: false,
    },
    rut_junta: {
        type: sequelize_1.DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    fk_id_comuna: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
}, {
    createdAt: false,
    timestamps: false,
    tableName: 'junta_vecinal'
});
exports.JuntaVecinal.belongsTo(exports.Comuna, { foreignKey: 'fk_id_comuna' });
exports.Proyecto = connection_1.default.define('Proyecto', {
    id_proyecto: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: sequelize_1.DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    descripcion: {
        type: sequelize_1.DataTypes.STRING,
        unique: true,
        allowNull: true,
    },
    cupo_min: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    cupo_max: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    estado: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    ruta_imagen: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    fecha_proyecto: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    fk_id_junta_vecinal: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
}, {
    createdAt: false,
    timestamps: false,
    tableName: 'proyecto'
});
exports.Reporte = connection_1.default.define('Reporte', {
    id_reporte: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    rut_vecino: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    fk_id_proyecto: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
}, {
    createdAt: false,
    timestamps: false,
    tableName: 'reporte'
});
exports.RepresentanteVecinal = connection_1.default.define('RepresentanteVecinal', {
    id_representante_vecinal: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    rut_representante: {
        type: sequelize_1.DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    primer_nombre: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    segundo_nombre: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    primer_apellido: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    segundo_apellido: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    comuna_rep: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    direccion: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    numero: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    correo_electronico: {
        type: sequelize_1.DataTypes.STRING,
        // unique: true,
        allowNull: false,
    },
    telefono: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    contrasenia: {
        type: sequelize_1.DataTypes.STRING,
        //unique: true,
        allowNull: false,
        // validate: {
        //     isFiveDigits(value: Number) {
        //       if (value.toString().length !== 5) {
        //         throw new Error('La contraseña debe tener 5 dígitos');
        //       }
        //     }
        // }
    },
    avatar: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    ruta_evidencia: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    ruta_firma: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    fk_id_junta_vecinal: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
}, {
    createdAt: false,
    timestamps: false,
    tableName: 'representante_vecinal'
});
exports.RepresentanteVecinal.belongsTo(exports.JuntaVecinal, { foreignKey: 'fk_id_junta_vecinal' });
exports.Actividad = connection_1.default.define('Actividad', {
    id_actividad: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: sequelize_1.DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    descripcion: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    ruta_imagen: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    fecha_actividad: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    fk_id_representante_vecinal: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
}, {
    createdAt: false,
    timestamps: false,
    tableName: 'actividad'
});
exports.Vecino = connection_1.default.define('Vecino', {
    id_vecino: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    rut_vecino: {
        type: sequelize_1.DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    primer_nombre: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    segundo_nombre: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    primer_apellido: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    segundo_apellido: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    direccion: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    correo_electronico: {
        type: sequelize_1.DataTypes.STRING,
        // unique: true,
        allowNull: false,
    },
    telefono: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    contrasenia: {
        type: sequelize_1.DataTypes.STRING,
        // unique: true,
        allowNull: false,
        // validate: {
        //     isFiveDigits(value: Number) {
        //       if (value.toString().length !== 5) {
        //         throw new Error('La contraseña debe tener 5 dígitos');
        //       }
        //     }
        // }
    },
    avatar: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    ruta_evidencia: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    estado: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: false,
    },
    fk_id_junta_vecinal: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
}, {
    createdAt: false,
    timestamps: false,
    tableName: 'vecino'
});
exports.Vecino.belongsTo(exports.JuntaVecinal, { foreignKey: 'fk_id_junta_vecinal' });
exports.Certificado = connection_1.default.define('Certificado', {
    id_certificado: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    descripcion: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    fk_id_vecino: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
}, {
    createdAt: false,
    timestamps: false,
    tableName: 'certificado'
});
exports.Solicitud = connection_1.default.define('Solicitud', {
    id_solicitud: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    tipo_solicitud: {
        type: sequelize_1.DataTypes.STRING,
        unique: true,
        allowNull: true,
    },
    descripcion: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    estado_solicitud: {
        type: sequelize_1.DataTypes.STRING,
        unique: false,
        allowNull: false,
    },
    fk_id_vecino: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
}, {
    createdAt: false,
    timestamps: false,
    tableName: 'solicitud'
});
exports.Valoracion = connection_1.default.define('Valoracion', {
    id_valoracion: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    comentario: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    cantidad_estrellas: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    estado_solicitud: {
        type: sequelize_1.DataTypes.STRING,
        unique: false,
        allowNull: false,
    },
    fk_id_vecino: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
}, {
    createdAt: false,
    timestamps: false,
    tableName: 'valoracion'
});
