import { Router } from "express";
import {cambiarContrasena } from "../controllers/resetpass";
//creacion de la ruta para los usuarios
const router = Router();
//ruta para crear un nuevo usuario y para el login
router.post('/cambiarcontra', cambiarContrasena);
//exportamos la ruta
export default router;