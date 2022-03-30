const { StatusCodes } = require("http-status-codes");
const { decodeToken, failureCase, getTokenFromHeader, getUser, successCase, countObjects } = require("../../../common/commonFunctions");
const paginationHelper = require("../../../common/Services/paginationService");
const updateService = require("../../../common/Services/updateServices");

const postModel = require("./../postModel/postModel");

function checkPostExist(id) {
    return new Promise(async (x) => {
        try {
            let post = await postModel.findById(id);
            console.log(post);
            if (post) {
                x(post);
            }
            else {
                x(null);
            }
        } catch (error) {
            console.log("error in finding post by ID :" + id + " \n", error);
            x(null)
        }
    })
}





async function addPost(req, res) {
    let { title, desc } = req.body;
    try {
        const token = getTokenFromHeader(req);
        const token_decoded = decodeToken(token); // remove the created b by from token .
        let { id, email } = token_decoded;
        let user = await getUser(id, false);
        if (user) {
            if (user.isBlocked) {
                failureCase(res, "error in adding post.", "blocked user cannot add posts.", StatusCodes.BAD_REQUEST);
            } else {
                let newPost = new postModel({ title, desc, CreatedBy: id });
                console.log(newPost);
                let data = await newPost.save();
                successCase(res, data, "post added successfully.", StatusCodes.CREATED);
            }

        } else {
            failureCase(res, "error in adding post.", "invalid user ID.sign in to add a post.", StatusCodes.BAD_REQUEST);
        }
    } catch (error) {
        failureCase(res, error, "error in adding post.");
    }
}

async function editPost(req, res) {
    let { postId } = req.params;
    let { title, desc } = req.body;
    const token = getTokenFromHeader(req);
    const token_decoded = decodeToken(token);
    try {
        let { id, email } = token_decoded;
        console.log("postId = ", postId, "user Id = ", id);
        let isPostExist = await checkPostExist(postId);
        console.log(isPostExist);

        let isUserExist = await getUser(email);
        if (!isPostExist) {
            failureCase(res, "invalid post ID.", "post doesnot exist to be edited.", StatusCodes.BAD_REQUEST);
        } else if (!isUserExist) {
            failureCase(res, "invalid user ID", "this user is no longer Exist.", StatusCodes.BAD_REQUEST);
        } else {
            if (id == isPostExist.CreatedBy) {
                let oldData = await updateService(postModel, { _id: postId }, { title, desc });
                // let updatedPost = await postModel.findByIdAndUpdate(postId, { title, desc });
                if (oldData.Result) {
                    successCase(res, oldData, "post updated successfully.", StatusCodes.OK);
                } else {
                    failureCase(res, oldData.error, "error in updating post.", StatusCodes.INTERNAL_SERVER_ERROR);
                }
            }
            else failureCase(res, "error in editing user post.", "cannot edit other users posts. ", StatusCodes.INTERNAL_SERVER_ERROR);
        }
    } catch (error) {
        failureCase(res, error, "error in editing user post.", StatusCodes.INTERNAL_SERVER_ERROR);
    };

}
async function deletePost(req, res) {
    let { postId } = req.params;
    const token = getTokenFromHeader(req);
    try {
        let { id, email } = decodeToken(token);
        let post = await checkPostExist(postId);
        if (!post) {
            failureCase(res, "error in deleting post", "post doesnot exist to be deleted", StatusCodes.BAD_REQUEST);
        } else {
            const user = await getUser(email);
            if (post.CreatedBy == id || user.role != "user") { // the owner of the post and the admin has the authority to delete a post.
                let postDeleted = await postModel.deleteOne({ _id: postId });
                successCase(res, postDeleted);
            }
        }
    } catch (error) {
        failureCase(res, error, "error in deleting post", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getProfilePosts(req, res) {
    const token = getTokenFromHeader(req);
    const { userId } = req.params;
    const { pageSize, pageNum } = req.query;
    const { skip, limit } = paginationHelper(pageNum, pageSize);
    try {
        let { id, email } = decodeToken(token);
        const user = await getUser(email);
        if (userId == id || user.role != "user") { // the owner of the post and the admin has the authority to delete a post.
            let condition = { CreatedBy: userId };
            let posts = await postModel.find(condition).skip(skip).limit(limit);
            const totalCount = await countObjects( postModel,condition);
            successCase(res, { totalCount, posts });
        }

    } catch (error) {
        failureCase(res, error, "error in get user posts", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getAllPostsHandler(res, pageNum, pageSize, projection, validPosts = true) {
    //paginationHelper

    try {
        let { skip, limit } = paginationHelper(pageNum, pageSize);
        // console.log(skip);
        //get the valid post for users and all post for admin
        const condition = validPosts ? { blocked: { $ne: true } } : {} ;
        const totalCount = await countObjects( postModel,condition);
        let posts = await postModel.find(condition , projection).populate({
            path: 'CreatedBy',
            select: 'name email _id'
        }).skip(skip).limit(limit);//.sort({"verified":-1}) to get the verified emails first . 
        successCase(res, { totalCount, posts } );
        // successCase(res, );
    } catch (error) {
        failureCase(res, error, "error in getting posts", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}


async function getAllPosts(req, res) {
    let { pageNum, pageSize } = req.query;
    await getAllPostsHandler(res, pageNum, pageSize, 'title desc blocked', false);
}

async function getAllUsersPosts(req, res) {
    let { pageNum, pageSize } = req.query;
    await getAllPostsHandler(res, pageNum, pageSize, 'title desc createdAt');
}


async function reportPost(req, res) {
    let { postID, comment } = req.body;
    const token = getTokenFromHeader(req);

    // const token = getTokenFromHeader(req);
    try {
        const token_decoded = decodeToken(token); // remove the created b by from token .
        let { id, email } = token_decoded;
        // let { id, email } = decodeToken(token);
        const user = await getUser(id, false);
        const post = await checkPostExist(postID);
        if (post) {

            let oldData = await postModel.findOneAndUpdate({ _id: postID }, {
                reported: true, $push: {
                    reportedBy: {
                        user: id,
                        comment
                    }
                }
            });
            successCase(res, oldData, "post reported successfully");

        } else {
            failureCase(res, "error in report post", "post doesnot exist any more", StatusCodes.BAD_REQUEST);
        }


    } catch (error) {
        failureCase(res, error, "error in get user posts", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function reviewReportedPosts(req, res) {
    let { pageNum, pageSize } = req.query;
    const { skip, limit } = paginationHelper(pageNum, pageSize);
    try {
        const condition = { reported: true };
        const totalCount = await countObjects( postModel,condition);
         
        const posts = await postModel.find(condition).populate({
            path: 'CreatedBy reportedBy.user',
            select: 'name email _id'
        }).skip(skip).limit(limit);
        successCase(res, { totalCount, posts } );
        // successCase(res, , " ");
    } catch (error) {
        failureCase(res, error, "error in getting reported posts", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function blockPost(req, res) {
    let { postId } = req.params;

    try {

        let isPostExist = await checkPostExist(postId);
        if (isPostExist) {
            let { reported } = isPostExist;
            if (reported) {
                let data = await postModel.findByIdAndUpdate(postId, { blocked: true });
                successCase(res, data);
            } else {
                failureCase(res, "error in blocking post", "cannot block unreported posts.", StatusCodes.BAD_REQUEST);
            }
        } else {
            failureCase(res, "error in blocking post", `no post exist with ID: ${postId} `, StatusCodes.BAD_REQUEST);
        }
    } catch (error) {
        failureCase(res, error, "error in blocking post.");
    }
}

module.exports = {
    addPost, editPost, deletePost, getProfilePosts, getAllPosts,
    getAllUsersPosts, reportPost, reviewReportedPosts, blockPost
}