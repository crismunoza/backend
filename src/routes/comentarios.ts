import{Router} from "express";
import { getcomentarios } from "../controllers/comentarios";
import validatetoken from "./validate-token";
//creacion de la ruta para los comentarios
const router = Router();
//ruta para obtener los comentarios y validar el token
router.get('/', getcomentarios);

//exportamos la ruta
export default router;