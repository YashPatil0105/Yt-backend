import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query
    const comment = await videoId.Comment
    if(!comment){
        throw new ApiError(400,"comment not found")
    }
    return res
    .status(200)
    .json(new ApiResponse(200,comment,"Comment fetched successfully"))

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {content}  = req.body
    const {videoId} = req.params.videoId
    console.log(content)
    console.log("Video ID:", req.params);

    const comment = await Comment.create({
        content,
        video : videoId,
        owner : req.user._id,
    })
    if(!comment){
        throw new ApiError(500,"Error while creating comment")
    }
    return res
    .status(200)
    .json(new ApiResponse(200,{comment},"Comment added successfully"))
    // console.log(comment)


})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {content} =  req.body
    const {commentId} = req.params
    
    console.log("req.params:", JSON.stringify(req.params));
    
    const actualCommentId = commentId.slice(1);
    if (!content) {
        throw new ApiError(400, "Comment file is missing");
      }

      if (!mongoose.Types.ObjectId.isValid(actualCommentId)) {
        throw new ApiError(400, "Invalid comment ID");
      }
      const comment = await Comment.findByIdAndUpdate(
        actualCommentId,
        // req.comment?._id,
        {
          $set: { content, }
        },
        {
          new: true,
        }
      );
      return res
      .status(200)
      .json(new ApiResponse(200 , comment,"Comment updated"))
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    
    const {commentId} = req.params
    
    console.log("req.params:", JSON.stringify(req.params));
    
    const actualCommentId = commentId.slice(1);


      if (!mongoose.Types.ObjectId.isValid(actualCommentId)) {
        throw new ApiError(400, "Invalid comment ID");
      }
      const deletedComment = await Comment.findByIdAndDelete(actualCommentId);

      if (!deletedComment) {
        throw new ApiError(404, "Comment not found");
      }

      return res
      .status(200)
      .json(new ApiResponse(200 , null,"Comment deleted successfully"))
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }