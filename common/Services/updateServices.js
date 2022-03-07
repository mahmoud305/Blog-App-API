// which is better to send the res to the function to return the final result or 

const { successCase, failureCase } = require("../commonFunctions");

// to make this function return promise and return the result in the main function that calls this function.
async function updateService(model,filter,update){
    try {
        const data = await model.findOneAndUpdate(filter,update);
        return {Result:true ,data};
        // successCase(res,oldData,"user Account deActivated.");
    
    } catch (error) {
        console.log(error);
        return {Result:false,error};
        // failureCase(res,"error in deActivating user Account",error);
    }
}

module.exports= updateService;