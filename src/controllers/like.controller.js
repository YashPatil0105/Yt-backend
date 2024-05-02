import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"

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
    const actualCommentId = commentId.slice(1)
    if (!mongoose.Types.ObjectId.isValid(actualCommentId)) {
        throw new ApiError(400, "Invalid video ID");
    }
    const existingLike = await Like.findOne({
        comment : actualCommentId,
        likedBy : req.user?._id
    })
    if(existingLike) {
        await Like.findByIdAndDelete(existingLike._id);
    
    }
    else{
        await Like.create({
            comment: actualCommentId,
            likedBy: req.user.id
        });
    } // If the user hasn't liked the video, add the like
    
    return res
    .status(200)
    .json(new ApiResponse(200,`Like ${existingLike ? 'removed' : 'added'} successfully`))


})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
    const actualTweetId = tweetId.slice(1)
    if (!mongoose.Types.ObjectId.isValid(actualTweetId)) {
        throw new ApiError(400, "Invalid video ID");
    }
    const existingLike = await Like.findOne({
        tweet : actualTweetId,
        likedBy : req.user?._id
    })
    if(existingLike) {
        await Like.findByIdAndDelete(existingLike._id);
    
    }
    else{
        await Like.create({
            tweet: actualTweetId,
            likedBy: req.user.id
        });
    } // If the user hasn't liked the video, add the like
    
    return res
    .status(200)
    .json(new ApiResponse(200,`Like ${existingLike ? 'removed' : 'added'} successfully`))

}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const userId = req.user.id;

    try {
         const userLikes = await Like.find({ likedBy: userId });

        // Extract video IDs from the user's likes
        const videoIds = userLikes.map(like => like.video);

        // Query the Video collection for videos with matching IDs
        const likedVideos = await Video.find({ _id: { $in: videoIds } });

        return res
        .status(200)
        .json(new ApiResponse(200 , likedVideos ,"Liked videos fetched successfully"));
    } catch (error) {
        console.error(error)
        throw new ApiError(500 ,"Error while fetching videos")
    }
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}