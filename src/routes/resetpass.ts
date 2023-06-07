import { Router } from "express";
import {verificarRut,verificarCorreo,cambiarContrasena } from "../controllers/resetpass";
//creacion de la ruta para los usuarios
const router = Router();
//ruta para crear un nuevo usuario y para el login
// router.get('/', cambiarContrasena);
router.get('/:rut', verificarRut);
router.get('/vericorreo/:correo_electronico', verificarCorreo);
router.post('/cambiarcontra', cambiarContrasena);
//exportamos la ruta
export default router;