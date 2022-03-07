const postRouter = require("express").Router();
const authorization = require("../../../common/middleWare/authorization");
const validateRequest = require("../../../common/middleWare/validateRequest");
const { addPostValidation, editPostValidation, reportPostValidation, blockPostValidation, deletePostValidation,
     getAllPostsValidation, getProfilePostsValidation } = require("../JoiValidation/endPointsValidation");
const { ADD_POST, GET_ALL_POSTS, GET_ALL_USERS_POSTS, GET_REPORTED_POSTS, DELETE_POST, GET_PROFILE_POSTS, BLOCK_POST,
     EDIT_POST, REPORT_POST } = require("../postEndPoints");
const { addPost, editPost, deletePost, getProfilePosts, getAllPosts, getAllUsersPosts, reportPost, reviewReportedPosts,
     blockPost}= require("./../postController/postController");



postRouter.post("/addPost" ,  authorization(ADD_POST) , validateRequest(addPostValidation) ,addPost); 
postRouter.put("/editPost/:postId",authorization(EDIT_POST) ,validateRequest(editPostValidation) , editPost); 
postRouter.put("/reportPost",authorization(REPORT_POST) , validateRequest(reportPostValidation), reportPost); 
postRouter.put("/blockPost/:postId", authorization(BLOCK_POST), validateRequest(blockPostValidation) , blockPost); 
postRouter.delete("/deletePost/:postId", authorization(DELETE_POST), validateRequest(deletePostValidation) , deletePost); 
postRouter.get("/getProfilePosts/:userId", authorization(GET_PROFILE_POSTS) , validateRequest(getProfilePostsValidation)  , getProfilePosts);
postRouter.get("/getAllPosts", authorization(GET_ALL_POSTS) , validateRequest(getAllPostsValidation) ,  getAllPosts);
postRouter.get("/getAllUsersPosts" , authorization(GET_ALL_USERS_POSTS) , validateRequest(getAllPostsValidation) ,getAllUsersPosts);
postRouter.get("/reviewReportedPosts" ,  authorization(GET_REPORTED_POSTS), validateRequest(getAllPostsValidation),  reviewReportedPosts);
    
module.exports =postRouter;

 