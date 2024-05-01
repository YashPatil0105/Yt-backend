import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video
    const videoLocalPath = req.files?.videoFile[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path;
    // console.log(req.files?.Video[0]?.path)
    if(!videoLocalPath){
        throw new ApiError(400,"Video file is required")
    }
    if(!thumbnailLocalPath){
        throw new ApiError(400,"thumbnail file is required")
    }

    const videoToUpload = await uploadOnCloudinary(videoLocalPath);
    const thumbnailToUpload = await uploadOnCloudinary(thumbnailLocalPath);
    if(!videoToUpload){
        throw new ApiError(400,"video is required")
    }
    if(!thumbnailToUpload){
        throw new ApiError(400,"thumbnail is required")
    }

    const video = await Video.create({
        title,
        description,
        videoFile : videoToUpload.url,
        thumbnail : thumbnailToUpload.url,
        owner : req.user?._id,
        duration: 120
        
    })

    return res
    .status(200)
    .json(new ApiResponse(200 ,video ,"video published successfully"))

})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}