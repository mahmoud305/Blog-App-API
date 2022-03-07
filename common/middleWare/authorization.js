const { StatusCodes } = require("http-status-codes");
const { getTokenFromHeader, decodeToken, failureCase, getUser } = require("../commonFunctions");
const rbac = require("../rbac/rbac");
function authorization(endPoint){
    return async (req,res,next)=>{
        const token = getTokenFromHeader(req);
        const decoded_Token= decodeToken(token);
        if(!decoded_Token){// token is invalid
            failureCase(res,"invalid Token.","sign in to continue. ",StatusCodes.BAD_REQUEST );
        }else{
            let {email,id}=decoded_Token;
            let user= await getUser(email);
            if(user){
                try {
                    let isAuthorized= await rbac.can(user.role,endPoint);
                if(isAuthorized){
                    next();
                }else{
                    failureCase(res,"Unauthorized User","",StatusCodes.UNAUTHORIZED);
                }
                } catch (error) {
                    failureCase(res,error,"error in authentication",StatusCodes.INTERNAL_SERVER_ERROR);
                }
                
            }else{
                failureCase(res,"error in authorization","this email is no longer exist.",StatusCodes.BAD_REQUEST);
            }
        }
    }
}

module.exports=authorization;