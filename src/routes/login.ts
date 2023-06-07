 import { Router } from "express";
import { UpdateProfile, getDataUser, login, profile } from "../controllers/user";
// import {verificarCorreo,cambiarContrasena } from "../controllers/resetpass";
// //creacion de la ruta para los usuarios
 const router = Router();
// //ruta para crear un nuevo usuario y para el login
router.post('/ingresar', login);
router.get('/profile',profile);
router.get('/data',getDataUser);
router.put('/update-perfil/:id_us',UpdateProfile);

 export default router;