import mongoose,{Schema} from "mongoose";

const followSchema = new Schema(
    {
        followedTo:{
            type: Schema.Types.ObjectId,
            ref: "User"
        },

        followedBy: {
            type : Schema.Types.ObjectId,
            ref:"User"
        }

    },{timestamps: true}
)

export const Follow = mongoose.model("Follow",followSchema)