const Joi = require("joi");

module.exports={
    addPostValidation:{ //{ title, desc, CreatedBy } = req.body; 
        body:Joi.object().keys({
            title:Joi.string().required(),
            desc:Joi.string().required() ,
        })
    },
    editPostValidation:{ //  { postId } = req.params;  { title, desc } = req.body;
        body:Joi.object().keys({
            title:Joi.string().required(),
            desc:Joi.string().required()
        }),
        params:Joi.object().keys({
            postId:Joi.string().required()
        }) ,
       
    },
    deletePostValidation:{// { postId } = req.params; 
        params:Joi.object().keys({
            postId:Joi.string().required()
        }),
       
    },

    getProfilePostsValidation:{//{ pageNum, pageSize } = req.query; { userId } = req.params;
        params:Joi.object().keys({
            userId:Joi.string().required()
        }),
        query:Joi.object().keys({
            pageNum:Joi.number().optional(),
            pageSize:Joi.number().optional(),
        })
    },
    getAllPostsValidation:{//{ pageNum, pageSize } = req.query;
        query:Joi.object().keys({
            pageNum:Joi.number().optional(),
            pageSize:Joi.number().optional(),
        })
    },

    getUserPostsValidation:{
        params:Joi.object().keys({
            id:Joi.string().required()
        }),
    },
    reportPostValidation:{ //{ userID, postID, comment } = req.body;
        body:Joi.object().keys({
            userID:Joi.string().required(),
            postID:Joi.string().required(),
            comment:Joi.string().required()
        }),
        
    },
    blockPostValidation:{//{ postId } = req.params;
        params:Joi.object().keys({
            postId:Joi.string().required(),
        })
    },

}