import { Router } from "express";
import {vercontacto} from "../controllers/contact";

const router = Router();

router.get("/:id_junta_vecinal", vercontacto);


export default router;