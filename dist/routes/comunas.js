"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const comunas_1 = require("../controllers/comunas");
const router = (0, express_1.Router)();
router.get('/', comunas_1.getComunas);
exports.default = router;
