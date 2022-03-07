const { StatusCodes } = require("http-status-codes");
const { failureCase, successCase, hashingPassword, decodeToken, getTokenFromHeader, getUser } = require("../../../common/commonFunctions");
const userModel = require("../userModel/userModel");
const jwt = require("jsonwebtoken");
const sendEmail = require("../../../common/Services/SendEmail");
const { findOneAndUpdate } = require("../userModel/userModel");
const bcrypt = require("bcryptjs");
const updateService = require("../../../common/Services/updateServices");
const paginationHelper = require("../../../common/Services/paginationService");


function generateToken(id, email) {
    try {
        let token = jwt.sign({ id, email }, process.env.JWT_SECREET_KEY, { expiresIn: '1h' })
        return token;
    } catch (error) {
        console.log("error in encoding the token, ", error);
        return null;
    }
}
function AddUser(res, name, email, password, cPassword, location, phone, currentHost, role = "user") {
    return new Promise(async (callback) => {
        try {
            if (password == cPassword) {
                let checkUserExist = await getUser(email);
                if (!checkUserExist) { // if user is not exist then register normally 
                    let newUser = new userModel({ name, email, password, cPassword, location, phone ,role });
                    console.log(newUser);
                    let newUserData = await newUser.save();
                    let userToken = generateToken(newUser._id, email);
                  
                    let verificationEmail = await sendEmail([email], "EMAIL VERFICATION ✔",
                        `<b>Hello world?</b>
                        <a href="http://${currentHost}/verifyUserEmail/${userToken}">press the link to verify ypur email </a>`);

                    successCase(res, newUserData, "user Registered. Verify Your Email to login Now :)", StatusCodes.CREATED);

                }
                else {
                    failureCase(res, " this email already registered", "", StatusCodes.BAD_REQUEST);
                }
            }
            else {
                failureCase(res, "password and confirmation password doesnot match", "", StatusCodes.BAD_REQUEST);
            }

        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ result: "failed", error });
        }
    })
}

async function signup(req, res) {
    let { name, email, password, cPassword, location, phone } = req.body;
     
    await AddUser(res, name, email, password, cPassword, location, phone ,req.headers.host)
}

async function addAdmin(req, res) {
    let { name, email, password, cPassword, location, phone } = req.body;

    await AddUser(res, name, email, password, cPassword, location, phone, req.headers.host,"admin");
}



function checkemailVerfiied(email) {

    return new Promise(async (callBack) => {
        try {
            let user = await getUser(email);// to get the userr info .
            if (user.isVerified) {
                callBack(true);
            }
            else {
                callBack(false)
            }
        } catch (error) {
            console.log("error in email verification check");
            callBack(false);
        }
    })

}
async function verifyEmail(req, res) {
    // console.log("hello");
    let { token } = req.params;
    try {
        let { email, id } = decodeToken(token);
        let isVerified = await checkemailVerfiied(email);
        if (isVerified) {
            successCase(res, {}, "email already verified");
        } else {
            // console.log("email verified is , ",email);
            let checkUserExist = await getUser(email);
            if (checkUserExist) {
                // console.log("inside");
                let updatedUser = await userModel.findOneAndUpdate({ email }, { isVerified: true });
                // console.log("out now");
                successCase(res, updatedUser, "email verified successfully");
            } else {
                failureCase(res, "error: Invalid Token", "", StatusCodes.BAD_REQUEST);
            }
        }
    } catch (error) {
        failureCase(res, error);
    }
}


function checkingHashedPassword(password, hashedPassword) {
    return new Promise(async (callback) => {
        try {
            const passwordCheck = await bcrypt.compare(password, hashedPassword);
            callback(passwordCheck);
        } catch (error) {
            console.log("error in hashing the password.");
            callback(null);
        }
    })
}

async function signin(req, res) {
    let { email, password } = req.body;
    // console.log(req.body);

    try {
        let user = await getUser(email);

        if (!user) {
            failureCase(res, "error in logging.", "emai is not registered", StatusCodes.BAD_REQUEST);
            return;
        }
        //console.log("user ", user);
        let isVerified = await checkemailVerfiied(email);
        if (isVerified) {
            let passwordCheck = await checkingHashedPassword(password, user.password);
            if (!passwordCheck) {
                failureCase(res, "error in logging.", "incorrect password", StatusCodes.BAD_REQUEST);
                return;
            }
            let token = generateToken(user._id, email);  //  console.log("before Token");

            //let token = await jwt.sign({ email, _id: user._id }, process.env.JWT_SECREET_KEY, { expiresIn: '1h' });
            //console.log(token);
            //res.status(StatusCodes.ok).json(message:"success",token,data:email);
            successCase(res, { token, email, id: user._id }, "Loged In Successfully");
        } else {
            failureCase(res, "error in logging.", "your email need to be verified to be able to login ", StatusCodes.FORBIDDEN);
        }
        // res.status(StatusCodes.OK).json({message:`success` ,data : { email,id:user._id,token}, });
    } catch (error) {
        failureCase(res, error, "error in logging.", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}



async function updateProfileHandler(req, res) {
    const token = getTokenFromHeader(req);
    const { id } = req.params;
    const { name, location } = req.body;
    const decoded_Token = decodeToken(token);
    if (decoded_Token) {
        if (decoded_Token.id == id) {// the user can only update itself 
            let userExist = await getUser(id, false);
            if (userExist) {
                try {
                    let oldData = await userModel.findOneAndUpdate({ _id: id }, { name, location });
                    successCase(res, oldData, "user updated successfully.");
                } catch (error) {
                    failureCase(res, error, "error in updating profile.", StatusCodes.INTERNAL_SERVER_ERROR);
                }
            } else {
                failureCase(res, "error in updatinhg user.", `user with id:${id} , doesnot exist any more `, StatusCodes.BAD_REQUEST);
            }
        } else {
            failureCase(res, "error in updatinhg user.", "user can only update its account only.", StatusCodes.BAD_REQUEST);
        }
    } else {
        failureCase(res, "error in updating user", "invalid Token set in headers");
    }
}

async function updatePasswordHandler(req, res) {
    const { id } = req.params;
    const { oldPassword, newPassword, cNewPassword } = req.body;
    const token = getTokenFromHeader(req);
    const decoded_Token = decodeToken(token);
    // let isPasswordMatch=await bcrypt.compare(password, user.password);
    if (newPassword == cNewPassword) {
        let user = await getUser(id, false);
        if (user) {
            if (id == decoded_Token.id) {
                let oldPasswordCheck = await checkingHashedPassword(oldPassword, user.password);
                if (oldPasswordCheck) { // there are identical so update the password
                    let newHashed_Password = await hashingPassword(newPassword);
                    const oldData = await updateService(userModel, { _id: id }, {
                        password: newHashed_Password,
                        cPassword: newHashed_Password
                    });
                    if (oldData.Result) {
                        successCase(res, oldData.data, "user updated successfully.");
                    } else {
                        failureCase(res, oldData.error, "error in updating password.", StatusCodes.INTERNAL_SERVER_ERROR);
                    }
                    // try {
                    //     let oldData = await userModel.findOneAndUpdate({ _id: id }, {
                    //         password: newHashed_Password,
                    //         cPassword: newHashed_Password
                    //     });
                    //     successCase(res, oldData, "user updated successfully.");
                    // } catch (error) {
                    //     failureCase(res, error, "error in updating password.", StatusCodes.INTERNAL_SERVER_ERROR);
                    // }
                } else {
                    failureCase(res, "error in updating user Password.", "invalid old password.", StatusCodes.BAD_REQUEST);
                }
            } else {
                failureCase(res, "error in updatinhg user Password.", "user can only update its account only.", StatusCodes.BAD_REQUEST);
            }
        } else {
            failureCase(res, "error in updating user password", `user with id:${id} , doesnot exist any more `, StatusCodes.BAD_REQUEST);
        }
    } else {
        failureCase(res, "error in updating password.", "password and confirmation password doesnot match", StatusCodes.BAD_REQUEST);

    }

}
async function passwordReset(req, res) {
    const { token } = req.params;
    /**
     * a front end page should handle the situation at this point to take the new password 
     * from the user after it clicks on the link that was sent to its email.
     * the token is used to give the frontend information about the user.
     * 
    */
    const decoded_Token = decodeToken(token);
    const user = await getUser(decoded_Token.email);
    if (user) {
        successCase(res, user, "password supoosed to be reset");
    }
    else {
        failureCase(res, "error in reseting the password", "invalid Token, user doesnot exist", StatusCodes.BAD_REQUEST);
    }
}
async function forgetPasswordHandler(req, res) {
    const { email } = req.body;
    let user = await getUser(email);
    if (user) {
        let userToken = generateToken(user._id, email);
        let Reset_Email = await sendEmail([email], "RESET PASSWORD ✔",
            `<b>Password Reset</b>
            <a href="http://${req.headers.host}/ResetUserPassword/${userToken}">press the link to Reset your password. </a>`);

        successCase(res, Reset_Email, "A Reset mail was sent to your email.", StatusCodes.CREATED);

    } else {
        failureCase(res, "error in password reset operation.", "unregistered email entered.", StatusCodes.BAD_REQUEST);
    }
}


const getAllUsers = async (req, res) => {
    let { pageNum, pageSize } = req.query;
    //console.log(pageNum, pageSize);
    pageSize = pageSize || 3;
    pageNum = pageNum || 1;
    try {
        let  {skip , limit} = paginationHelper(pageNum, pageSize);
        let users = await userModel.find({ },' _id name email isVerified role').skip(skip).limit(limit);//.sort({"verified":-1}) to get the verified emails first . 
        successCase(res, users);
    } catch (error) {
        failedCase(res, error, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function dectivateAccount(req, res) {
    const token = getTokenFromHeader(req);
    const { id } = req.params;
    const decoded_Token = decodeToken(token);
    console.log("hello");
    if (decoded_Token.id == id) {//user can deActivate its account only 
        const user = await getUser(id, false);
        if (user) {
            const oldData = await updateService(userModel, { _id: id }, { active: false });
            console.log((oldData));
            if (oldData.Result) {
                successCase(res, oldData.data, "user Account deActivated successfully.");
            } else {
                failureCase(res, oldData.error, "error in updating password.", StatusCodes.INTERNAL_SERVER_ERROR);
            }

        } else {
            failureCase(res, "error in deActivating user Account.", `user with id:${id} , doesnot exist any more `, StatusCodes.BAD_REQUEST)
        }

    } else {
        failureCase(res, " error in deActivating user Account.", "user Cannot deActivate another users accounts.", StatusCodes.BAD_REQUEST);
    }
}

async function blockAccount(req, res) {
    const token = getTokenFromHeader(req);
    const { id } = req.params;
    const decoded_Token = decodeToken(token);
    if (decoded_Token.id == id) {//user cannot block itself . 
        failureCase(res, " error in blocking user Account.", "user Cannot deActivate another users accounts.", StatusCodes.BAD_REQUEST);
    } else {
        const user = await getUser(id, false);
        if (user) {
            if(user.role=="user"){ 
            const oldData = await updateService(userModel, { _id: id }, { isBlocked: true });
            console.log((oldData));
            if (oldData.Result) {
                successCase(res, oldData.data, "user Account Blocked Successfully.");
            } else {
                failureCase(res, oldData.error, "error in Blocking User Account.", StatusCodes.INTERNAL_SERVER_ERROR);
            }
        }else{
            failureCase(res, "error in Blocking User Account." ,"admins cannot by blocked.", StatusCodes.INTERNAL_SERVER_ERROR);

        }

        } else {
            failureCase(res, "error in deActivating user Account.", `user with id:${id} , doesnot exist any more `, StatusCodes.BAD_REQUEST)
        }
    }
}

async function getAdminList(req, res) {
    const {pageNum,pageSize}=req.query;
    let {skip , limit}= paginationHelper(pageNum,pageSize);
    try {
        let admins = await userModel.find({ role: "admin" }, 'name email role _id isVerified').skip(skip).limit(limit);
        successCase(res, admins);
    } catch (error) {
        failureCase(res, error, "error in get Admin List.", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function deleteAdmin(req,res){
    const token = getTokenFromHeader(req);
    const { id } = req.params;
    const decoded_Token = decodeToken(token);
    if (decoded_Token.id == id) { 
        failureCase(res, " error in deleteing Admin Account.", "superAdmin Cannot be deleted .", StatusCodes.BAD_REQUEST);
    }else{
        const user = await getUser(id,false);
        console.log(user);
        if(user){
            if(user.role=="user"){
                failureCase(res,"error in Deleting user Account." ,"Users Accounts cannot be deleted.", StatusCodes.INTERNAL_SERVER_ERROR);
            }else{ 
            try {
                let deletedAdmin= await userModel.findByIdAndDelete(id);
                successCase(res,deleteAdmin,"admin account deleted successfully.");
            } catch (error) {
                failureCase(res, error,"error in Deleting Admin Account." , StatusCodes.INTERNAL_SERVER_ERROR);
            }
        }
        }else{
            failureCase(res, "error in deleting Admin Account.", `admin with id:${id} , doesnot exist any more `, StatusCodes.BAD_REQUEST);
        }
    }
}
module.exports = {
    signup, verifyEmail, signin, updateProfileHandler, updatePasswordHandler,
    forgetPasswordHandler, passwordReset, dectivateAccount,addAdmin, blockAccount, getAdminList ,deleteAdmin ,getAllUsers
};