import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    //TODO: get all videos based on query, sort, pagination
    // Destructuring query parameters with default values
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query

    
    try {
        // Constructing the base query
        let videoQuery = {};

        // If there's a query string, perform a text search
        if (query) {
            videoQuery = { $text: { $search: query } };
        }

        // If there's a userId, add a condition to filter by user ID
        if (userId) {
            videoQuery = { ...videoQuery, createdBy: userId };
        }

        // Sorting criteria
        let sortOptions = {};
        if (sortBy) {
            sortOptions[sortBy] = sortType === 'desc' ? -1 : 1;
        } else {
            // Default sorting by createdAt
            sortOptions.createdAt = -1;
        }

        // Pagination
        const skip = (page - 1) * limit;

        // Fetching videos based on the constructed query
        const videos = await Video.find(videoQuery)
            .sort(sortOptions)
            .skip(skip)
            .limit(parseInt(limit));

        // Counting total videos matching the query (for pagination)
        const totalVideos = await Video.countDocuments(videoQuery);

        res.status(200).json({ success: true, data: videos, total: totalVideos });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }

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
    const actualVideoId = videoId.slice(1)
    //TODO: get video by id
    const video = await Video.findById(actualVideoId)
    if(!video){
        throw new ApiError(404,"video not found")
    }
    return res
    .status(200)
    .json(new ApiResponse(200 , video,"video fetched successfully"))
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
    const {title , description} = req.body

    if(!title || !description){
        throw new ApiError(400, "title or description is required")
    } 
    // const videoLocalPath = req.files?.videoFile[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path;

    // if(!videoLocalPath){
    //     throw new ApiError(400,"Video file is required")
    // }
    if(!thumbnailLocalPath){
        throw new ApiError(400,"thumbnail file is required")
    }
    // const videoToUpload = await uploadOnCloudinary(videoLocalPath);
    const thumbnailToUpload = await uploadOnCloudinary(thumbnailLocalPath);
    // if(!videoToUpload){
    //     throw new ApiError(400,"video is required")
    // }
    if(!thumbnailToUpload){
        throw new ApiError(400,"thumbnail is required")
    }

    const video = await Video.findByIdAndUpdate(
        videoId,
        {
            $set:{
                title,
                description,
                thumbnail: thumbnailToUpload.url,
                // video : videoToUpload.url
            }
        },
        {new : true}
    )

    if(!video){
        throw new ApiError(501, "Error while updating video details ")
    }
    return res
    .status(200)
    .json(new ApiResponse(200 ,video ,"video detailes updated successfully"))

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
    const actualVideoId = videoId.slice(1)
    const video = await Video.findByIdAndDelete(actualVideoId)
    if(!video){
        throw new ApiError(404,"video doesnt exists")
    }
    return res
    .status(200)
    .json(new ApiResponse(200 , null,"video deleted successfully"))
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
//    const  actualVideoId = videoId.slice(1) 
    try {
        // Find the video by its ID
        const video = await Video.findById(videoId);

        // Check if the video exists
        if (!video) {
            throw new ApiError(404, "Video not found")
        }

        // Toggle the publish status
        video.isPublished = !video.isPublished;

        // Save the updated video
        await video.save();

       return res
       .status(200)
       .json(new ApiResponse(200 ,video,"toggle successfully"))
    } catch (error) {
        console.error(error);
        throw new ApiError(500 , "Something went wrong while saving the video")
    }
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}