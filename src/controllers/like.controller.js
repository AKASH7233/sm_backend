import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/apiResponse.js"
import { Like } from '../models/likes.model.js'
import mongoose, { isValidObjectId } from 'mongoose'
import { User } from '../models/user.model.js'

 

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
        if(!unlike){
            throw new ApiError(500, "Failed To unlike the post")
        }
    }
    else{
        like = await Like.create({
            post: postId,
            likedBy: req.user
        })

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

const LikedPost = asyncHandler(async(req,res)=>{
    const userInfo = await User.findById(req.user?._id).select("username ProfileImage")
    
    const {postId} = req.params
    if(!postId){
        throw new ApiError(400,"Invalid PostId")
    }

    const postlike = await Like.aggregate([
        {
            $match: {
                post: new mongoose.Types.ObjectId(postId)
            }
        },
        {
            $group: {
                _id: "post",
                likedBy: {$push: userInfo},
            }
        },        
    ])

    console.log(await Like.find({
        post: postId}
        ));
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            postlike,
            "liked User Fetched"
        )
    )
})

export {
    toggleLike,
    LikedPost
}