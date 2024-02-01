import { asyncHandler } from "../utils/asyncHandler.js";
import { Post } from "../models/post.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";

const showPosts = asyncHandler( async(_,res)=>{
    const getAllposts = await Post.find({"isPublished" : true})
    console.log(getAllposts);
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            getAllposts,
            "Get all Post"
        )
    )
})

const uploadPost = asyncHandler( async(req,res)=>{
    const {title} = req.body

    if(!title){
        throw new ApiError(401, "Title is Required")
    }

    const postLocalPath = req.files?.postFile[0].path;

    if(!postLocalPath){
        throw new ApiError(401, "Post should contain a Image/Video")
    }

    const postFile = await uploadToCloudinary(postLocalPath)

    if(!postFile){
        throw new ApiError(500, "Failed To upload post-file")
    }

    const isPublished = true

    const postedBy = await User.findById(req.user._id).select("-password -fullName -refreshToken -accessToken -email -coverImage -posts -createdAt -updatedAt ")

    const post = await Post.create({
        title,
        postFile : postFile.url,
        postedBy,
        isPublished
    })

    if(!post){
        throw new ApiError(500,"Failed to Upload Post")
    }
    

    const user = await User.findById(req.user._id)
    
    user.posts.push(post)
    user.save({validateBeforeSave : false})

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            post,
            "Post uploaded Successfully"
        )
    )
})

const updatePostTitle = asyncHandler( async(req,res)=>{
    const {title} = req.body
    const {postId} = req.params || req.body
    console.log(postId);
    
    if(!postId){
        throw new ApiError(500,"Failed to find Post !")
    }
    
    if(!title){
        throw new ApiError(401,"new Title is Required")
    }

    const post = await Post.findByIdAndUpdate(
        postId,
        {
            $set: {
                title
            }
        },
        {new: true}
    )

    console.log(post);
    if(!post){
        throw new ApiError(500,"Failed to update the Title")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            202,
            post,
            "Title updated Successfully"
        )
    )
})

const deletePost = asyncHandler( async(req,res)=>{
    const {postId} = req.params || req.body

    if(!postId){
        throw new ApiError(500,"Failed to find Post !")
    }

    await Post.findByIdAndDelete(
        postId  
    )

    return res
    .status(200)
    .json(
        new ApiResponse(202,{},"Post Deleted SuccessFully")
    )
})

const hidePost = asyncHandler( async(req,res)=>{
    const {postId} = req.params || req.body
    
    await Post.findByIdAndUpdate(
        postId,
        {
            $set: {
                isPublished : false
            }
        },
        {new : true}
    )

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {},
            "Post Hide Successfully"
        )
    )
})

export {
    uploadPost,
    updatePostTitle,
    deletePost,
    showPosts,
    hidePost
}