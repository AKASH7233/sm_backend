import { Router } from "express";
import { 
    deletePost, 
    updatePostTitle, 
    uploadPost, 
    showPosts, 
    hidePost 
} from "../controllers/post.controller.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.js";

const router = Router();
router.use(verifyJWT)

router.route('/post').post(
    showPosts
)

router.route('/uploadpost').post(
    upload.fields([
        {
            name: "postFile",
            maxCount: 10
        }
    ]),
    uploadPost
)

router.route('/updatepost/:postId').post(
    updatePostTitle
)

router.route('/deletepost/:postId').post(
    deletePost
)

router.route('/hidepost/:postId').post(
    hidePost
)


export default router