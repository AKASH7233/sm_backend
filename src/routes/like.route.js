import { Router } from "express";
import {verifyJWT} from "../middlewares/auth.js"
import {toggleLike} from "../controllers/like.controller.js"

const router = Router()
router.use(verifyJWT)

router.route('/togglelike/:postId').post(toggleLike)

export default router;

