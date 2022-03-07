const { StatusCodes } = require("http-status-codes");
const { failureCase } = require("../commonFunctions");


module.exports=(schema)=>{
    return (req,res,next)=>{
        let validateErrors=[];
        try {
            ["headers", "params", "query", "body", "file"].forEach( (key)=>{
                if(schema[key]){
                    let validationResult=schema[key].validate(req[key]);
                    if(validationResult.error){
                        validateErrors.push(validationResult.error.details[0].message);
                    }
                }
            } );
            if(validateErrors.length){
                failureCase(res,validateErrors.join("--"),"error in validating request",StatusCodes.BAD_REQUEST);
            }
            else{
                next();
            }
        } catch (error) {
            failureCase(res,"error in validation","Bad request",StatusCodes.BAD_REQUEST);
        }
    }
}