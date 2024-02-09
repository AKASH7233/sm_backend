import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.js";
import { postComment } from "../controllers/comment.controller.js";

const router = Router()
router.use(verifyJWT)

router.route('/addcomment/:postId').post(postComment)

export default router