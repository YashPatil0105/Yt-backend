import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    const actualVideoId = videoId.slice(1)
    console.log(actualVideoId)
//TODO: toggle like on video
    if (!mongoose.Types.ObjectId.isValid(actualVideoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const existingLike = await Like.findOne({
        video : actualVideoId,
        likedBy : req.user?._id
    })

    if(existingLike) {
        await Like.findByIdAndDelete(existingLike._id);
    
    }
    else{
        await Like.create({
            video: actualVideoId,
            likedBy: req.user.id
        });
    } // If the user hasn't liked the video, add the like
    
    return res
    .status(200)
    .json(new ApiResponse(200,`Like ${existingLike ? 'removed' : 'added'} successfully`))

    
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}