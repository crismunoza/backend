import { Router } from "express";
import {verificarCorreo,cambiarContrasena } from "../controllers/resetpass";
//creacion de la ruta para los usuarios
const router = Router();
//ruta para crear un nuevo usuario y para el login
// router.get('/', cambiarContrasena);
router.get('/', verificarCorreo);
router.post('/reset', cambiarContrasena);
//exportamos la ruta
export default router;