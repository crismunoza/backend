import { Router } from 'express';
import { getComunas } from '../controllers/comunas';
import validatetoken from "./validate-token";

const router = Router();

router.get('/', getComunas);

export default router;
