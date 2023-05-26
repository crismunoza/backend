"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const certificado_1 = require("../controllers/certificado");
const router = (0, express_1.Router)();
/**
 * Distinción de rutas según la información que se necesita manipular.
 */
router.get('/generate-pdf', certificado_1.getCertify);
router.get('/obtener-parrafo', certificado_1.getParagraph);
router.post('/update-subtitle', certificado_1.updateSubtitle);
exports.default = router;
