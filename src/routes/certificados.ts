import { Router } from 'express';
import { getCertify, updateSubtitle, getParagraph } from '../controllers/certificado';
import validatetoken from "./validate-token";

const router = Router();
/**
 * Distinción de rutas según la información que se necesita manipular.
 */
router.get('/generate-pdf', getCertify);
router.get('/obtener-parrafo', getParagraph);
router.post('/update-subtitle', updateSubtitle);


export default router;