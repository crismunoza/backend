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
exports.getMaxId = exports.queries = void 0;
const connection_1 = __importDefault(require("../db/connection"));
exports.queries = {
    //**query que comprueba la existencia de tablas en el esquema. */
    existsTables: `SELECT table_name FROM all_tables WHERE owner = 'C##JUNTA_VECINAL';`,
};
const getMaxId = (modelName, idField) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Model = connection_1.default.models[modelName];
        const result = yield Model.max(idField);
        const maxId = Number(result) || 0;
        return maxId + 1;
    }
    catch (error) {
        console.error(`Error al obtener el máximo id de ${modelName}:`, error);
        throw error;
    }
});
exports.getMaxId = getMaxId;
