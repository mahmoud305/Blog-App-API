const authorization = require("../../../common/middleWare/authorization");
const { signUpSchema, signInSchema, forgetPasswordSchema, updatePasswordSchema, deActivateaAccountSchema,
     blockAccountSchema, verifyEmailSchema, deleteAdminSchema, updateUserProfileSchema, getAllUsersSchema } = require("../JoiValidation/endPointValidation");
const { signup, verifyEmail, signin, updateProfileHandler, dectivateAccount, updatePasswordHandler, passwordReset, forgetPasswordHandler, getAdminList, blockAccount, deleteAdmin, addAdmin, getAllUsers } = require("../userController/userController");
const { ADD_ADMIN, GET_ADMIN_LIST, SIGN_IN, SIGN_UP, FORGET_PASSWORD, UPDATE_PROFILE_HANDLER, UPDATE_USER_PASSWORD, DEACTIVATE_USER_ACCOUNT, BLOCK_USER_ACCOUNT, DELETE_ADMIN, GET_ALL_USERS } = require("../userEndPoints");
const validateRequest = require("./../../../common/middleWare/validateRequest");
const userRouter = require("express").Router();

userRouter.post("/signup", validateRequest(signUpSchema), signup);
userRouter.post("/addAdmin", authorization(ADD_ADMIN), validateRequest(signUpSchema), addAdmin);
userRouter.post("/signin", validateRequest(signInSchema), signin);
userRouter.post("/forgetPassword", authorization(FORGET_PASSWORD), validateRequest(forgetPasswordSchema), forgetPasswordHandler);
userRouter.put("/updateUser/:id", authorization(UPDATE_PROFILE_HANDLER), validateRequest(updateUserProfileSchema), updateProfileHandler);
userRouter.put("/updateUserPassword/:id", authorization(UPDATE_USER_PASSWORD), validateRequest(updatePasswordSchema), updatePasswordHandler);
userRouter.put("/dectivateUserAccount/:id", authorization(DEACTIVATE_USER_ACCOUNT), validateRequest(deActivateaAccountSchema), dectivateAccount);
userRouter.put("/blockUserAccount/:id", authorization(BLOCK_USER_ACCOUNT), validateRequest(blockAccountSchema), blockAccount);

userRouter.get("/getAllUsers", authorization(GET_ALL_USERS), validateRequest(getAllUsersSchema), getAllUsers);
userRouter.get("/verifyUserEmail/:token", validateRequest(verifyEmailSchema), verifyEmail);
userRouter.get("/ResetUserPassword/:token", passwordReset);
userRouter.get("/getAdminList", authorization(GET_ADMIN_LIST), getAdminList);

userRouter.delete("/deleteAdminAccount/:id", authorization(DELETE_ADMIN), validateRequest(deleteAdminSchema), deleteAdmin);


module.exports = userRouter;