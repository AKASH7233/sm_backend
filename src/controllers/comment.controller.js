import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/apiResponse.js"
import { Comment } from '../models/comment.model.js'
import { isValidObjectId } from 'mongoose'
import { User } from '../models/user.model.js'
import { Post } from '../models/post.model.js'
import uniqid from 'uniqid';

const postComment = asyncHandler( async(req,res)=>{
    const {postId} = req.params;
    const {comment} = req.body;

    

   if(!isValidObjectId(postId)){
    throw new ApiError(400, "Invalid PostID")
   }

   const post = await Post.findById(postId)

   if(!post){
        throw new ApiError(500,"Failed to find Post")
   }

   if(!comment){
        throw new ApiError(400, "Comment is Required")
    }

   const commentedBy = await User.findById(req.user._id).select("username")

   if(!commentedBy){
    throw new ApiError(401, "Unauth request")
   }

   const comments = await Comment.create({
        post,
        comment,
        commentedBy
   })

   if(!comments) {
        throw new ApiError(500, "Failed to add Comment")
   }

   
   await post.commentedBy.push(comment)
   post.save()

   return res
   .status(200)
   .json(
    new ApiResponse(
            201,
            comments,
            "Comment added successfully !!"
        )
   )
})

export {
    postComment
}