const bcrypt = require("bcrypt");
const userModel = require("../src/User/userModel/userModel");
const jwt = require("jsonwebtoken");


function successCase(res,data,message="",statusCode=200){
    res.status(statusCode).json({Result:"success",data,message});
}

function failureCase(res,error,message="",statusCode=500){
    res.status(statusCode).json({Result:"failed",error,message});
}

function hashingPassword(password){
    return new Promise( async (callback)=>{
        try {
            const hashedPassword=await bcrypt.hash(password, 7);
            callback(hashedPassword); 
        } catch (error) {
            console.log("error in hashing the password.");
            callback(null);
        }
    } )
}

function getTokenFromHeader(req) {
    if (req.headers.authorization) {
        return req.headers.authorization.split(" ")[1];
    }
    else return null;
}
function decodeToken(token) {
    try {
        let decodedToken = jwt.verify(token, process.env.JWT_SECREET_KEY);
        console.log(decodedToken);
        return decodedToken
    } catch (error) {
        console.log("error in decoding token.\n", error);
        return null;
    }
}

function getUser(userInfo, isEmail = true) {

    return new Promise(async (callback) => {
        try {

            let user = await userModel.findOne(isEmail ? { email: userInfo } : { _id: userInfo });
            if (user) {
                callback(user);
            }
            else {
                callback(null);
            }
        } catch (error) {
            console.log("error in get User in common\n",error);
            callback(null);
            // failureCase(res, error);
        }
    })
}

module.exports={successCase ,failureCase ,hashingPassword ,getTokenFromHeader ,decodeToken, getUser}