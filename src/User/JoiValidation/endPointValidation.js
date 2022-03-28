const Joi = require("joi");

module.exports = {
    signUpSchema: {
        body: Joi.object().keys({ // name, email, password, cPassword, location, phone, role
            name: Joi.string().min(2).required(),
            email: Joi.string().email().required(),
            password: Joi.string().required(),
            cPassword: Joi.string().required(),
            phone: Joi.string().required().min(10),
            location: Joi.string().required().min(2),
            role: Joi.string().optional().valid("admin", "user"),
        })
    },
    signInSchema: {
        body: Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        })
    },
    verifyEmailSchema: {
        params: Joi.object().keys({
            token: Joi.string(),
        })
    },
    updateUserProfileSchema: { //   const { id } = req.params; const { name, location } = req.body;
        body: Joi.object().keys({  
           
            name: Joi.string().min(2).required(),
            location: Joi.string().required().min(2),
        }),
        params: Joi.object().keys({
            id: Joi.string().required(),
        })
    },
    /** const { id } = req.params;
    const { oldPassword, newPassword, cNewPassword } = req.body; */
    updatePasswordSchema: {
        body: Joi.object().keys({
            oldPassword: Joi.string().required(),
            newPassword: Joi.string().required(),
            cNewPassword: Joi.string().required(),
        }),
        params: Joi.object().keys({
            id: Joi.string().required(),
        })
    },
    forgetPasswordSchema: {//const { email } = req.body;
        body: Joi.object().keys({
            email: Joi.string().email().required(),
        }),
    },
    //const { id } = req.params;
    deActivateaAccountSchema: {
        params: Joi.object().keys({
            id: Joi.string().required(),
        })
    },
    blockAccountSchema: {
        params: Joi.object().keys({
            id: Joi.string().required(),
        })
    },
    checkIdInParams: {//const { id } = req.params;
        params: Joi.object().keys({
            id: Joi.string().required(),
        })
    },
    getAllUsersSchema: {
        query: Joi.object().keys({
            pageNum: Joi.number().optional(),
            pageSize: Joi.number().optional(),
        })

        ///should I check on the authorization in the req although it is not used in the end point but it is used in the previous middleware.
        // (the authorization contain a baerer token which is used in authentication of the user if it is admin or not ) 
        // headers:Joi.object().keys({
        //     authorization
        // })
    }

}