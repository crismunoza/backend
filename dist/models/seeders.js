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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Seeders = void 0;
const mer_1 = require("./mer");
class Seeders {
    constructor() {
        //**datos a insertar */
        this.dataComuna = [
            { nombre: '-------' },
            { nombre: 'Puente Alto' },
            { nombre: 'La Florida' },
            { nombre: 'Maipu' },
            { nombre: 'San Ramon' },
            { nombre: 'Macul' },
        ];
        //**promise que inserta los datos de inicio en las tablas comunas y municipalidad. */
        this.insertSeeders = () => __awaiter(this, void 0, void 0, function* () {
            try {
                // Verificar si la tabla Comuna contiene datos.
                const comunaCount = yield mer_1.Comuna.count();
                if (comunaCount > 0) {
                    console.log(`La tabla Comuna ya contiene ${comunaCount} registros.`);
                }
                else {
                    // Insertar datos en la tabla Comuna.
                    yield mer_1.Comuna.bulkCreate(this.dataComuna);
                    console.log('Se han insertado los datos correctamente en la tabla Comuna.');
                }
            }
            catch (error) {
                console.error('Error al insertar los datos:', error);
            }
        });
    }
}
exports.Seeders = Seeders;
