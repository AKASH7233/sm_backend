import mongoose,{Schema} from "mongoose";

const postSchema = new Schema(
    {
        postFile:{
            type: String,
            required: true
        },
        title: {
            type: String,
            required : true
        },
        description: {
            type: String,
        },
        duration:{
            type:Number
        },
        postedBy : {
            type : Schema.Types.ObjectId,
            ref: "User"
        },
        isPublished: {
            type: Boolean
        },
        likes:{
            type: Number,
            default: 0
        },
        likedBy:[
            {
                type: Schema.Types.ObjectId,
                ref: "Like",
            }
        ],
        comments:{
            type: Number,
            default: 0
        },
        commentedBy:[
            {
                type: Schema.Types.ObjectId,
                ref: "Comment",
            }
        ]
    },
    {timestamps: true}
)

export const Post = mongoose.model("Post", postSchema)