import { Router } from "express";
import publicacionController from "../controllers/publicacion";

const router = Router();

router.post('/agregar-publicacion', publicacionController.insertPublication);
router.get('/obtener-publicaciones/:idJuntaVecinal', publicacionController.getPublication);
router.put('/modificar-publicacion/:idPublicacion', publicacionController.updatePublication);

export default router;
