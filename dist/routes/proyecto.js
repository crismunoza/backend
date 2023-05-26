"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const proyecto_1 = __importDefault(require("../controllers/proyecto"));
const router = (0, express_1.Router)();
router.post('/agregar-proyecto', proyecto_1.default.insertProyect);
exports.default = router;
