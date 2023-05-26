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
exports.getComunas = void 0;
const mer_1 = require("../models/mer");
const getComunas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //se traen todas las comunas.
    const listComunas = yield mer_1.Comuna.findAll();
    // //retornamos las comunas en formato json
    res.json({ listComunas });
});
exports.getComunas = getComunas;
