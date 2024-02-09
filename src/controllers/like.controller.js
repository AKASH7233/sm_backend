import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/apiResponse.js"
import { Like } from '../models/likes.model.js'
import { isValidObjectId } from 'mongoose'
import { Post } from '../models/post.model.js'

 

const toggleLike = asyncHandler( async(req,res)=>{
    const {postId} = req.params
    
    if(!isValidObjectId(postId)){
        throw new ApiError(400, "Post Id is not Valid")
    }

    const postliked = await Like.findOne({
        post : postId
    })

    let like;
    let unlike;

    if(postliked){
        unlike = await Like.deleteOne({
            post : postId
        })
        const post = await Post.findById(postId)
        post.likedBy.pop(req.user)
        post.save()

        console.log(post);
        if(!unlike){
            throw new ApiError(500, "Failed To unlike the post")
        }
    }
    else{
        like = await Like.create({
            post: postId,
            likedBy: req.user._id
        })
        const post = await Post.findById(postId)
        await post.likedBy.push(req.user)
        post.save()        

        console.log(post);
        if(!like){
            throw new ApiError(
                500,
                "something went wrong while like video !!"
            )
        }
    }

    
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {},
            `User ${like ? "like" : "unlike"} post successfully !!`
        )
     )

})


export {
    toggleLike
}