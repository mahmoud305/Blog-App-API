const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
// const { hashingPassword } = require("../../../common/commonFunctions");




function encryptData(data) {

    const cipher = crypto.createCipheriv(process.env.ENCRYPTION_ALGORITHM,
        Buffer.from(process.env.ENCRYPTION_SECRUITY_KEY),
        Buffer.from(process.env.ENCRYPTION_INIT_VECTOR, 'hex'));
    let encryptedData = cipher.update(data, "utf-8", "hex");
    encryptedData += cipher.final("hex");
    return encryptedData.toString();
}

function decryptData(data) {
    try {
        console.log("info : ",info);
        const deCipher = crypto.createDecipheriv(process.env.ENCRYPTION_ALGORITHM,
            Buffer.from(process.env.ENCRYPTION_SECRUITY_KEY),
            Buffer.from(process.env.ENCRYPTION_INIT_VECTOR, 'hex'));
        let clearInfo = deCipher.update(Buffer.from(data,'hex'), 'hex', "utf-8");
        clearInfo += deCipher.final("utf8");
        return clearInfo;
    } catch (error) {
        console.log("error in decrption the phone number ", error);
        return null;
    }
}
const userSchema = mongoose.Schema(
    {
        // user information
        name: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
        cPassword: { type: String, required: true },
        phone: { type: String, required: true },
        location: { type: String, required: true },
        role: { type: String, enum: ["user", "admin", "superAdmin"], default: "user" },

        // user information for system
        reportedBy:[{type:mongoose.Types.ObjectId, ref:"user"}],
        isVerified: { type: Boolean, default: false },
        isBlocked: { type: Boolean, default: false },
        active: { type: Boolean, default: true },

    },
    {
        timestamps: true
    }
)
// userSchema.pre("save", async function (next) {
//     this.password = await bcrypt.hash(this.password, 7);
//     next();
//   });
function hashingPassword(password){
    return new Promise( async (callback)=>{
        try {
            // const temp=await bcrypt.hash("superAdmin", 7);
            // console.log("hashed password : ",temp);
            const hashedPassword=await bcrypt.hash(password, 7);
            callback(hashedPassword); 
        } catch (error) {
            console.log("error in hashing the password.");
            callback(null);
        }
    } )
}

userSchema.pre("save", async function (next) {
    // this.password = await bcrypt.hash(this.password, 7);
    console.log(this.phone);
    this.password= await hashingPassword(this.password);
    this.cPassword = this.password;//to hash the confirmation one .
    this.phone = encryptData(this.phone);
    console.log(this.phone);
    // console.log(decryptData(this.phone));
    next();
})

module.exports = userSchema;


// user email : amiraezzat@mozej.com .
// user Id: 6216e553240f736ca10e5fb6 .
//user Token :
/**   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyMTZlM2FhZTJkYjUwNmQ3MjFmN2Y1YiIsImVtYWlsIjoiYW1pcmFlenphdEBtb3plai5jb20iLCJpYXQiOjE2NDU2NjczMDYsImV4cCI6MTY0NTY3MDkwNn0.CZJqqLi8OvGXQOEa5Oil-ysXxAjcmNbcCsincAGfheY  */

//****************

// admin email : amiraezzat@mailna.co
// admin id: 6216e76fecb4c600206feb47
// admin token : 
/**eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJpZCI6IjYyMTZlNzZmZWNiNGM2MDAyMDZmZWI0NyIsImVtYWlsIjoiYW1pcmFlenphdEBtYWlsbmEuY28iLCJpYXQiOjE2NDU2NjgzMjgsImV4cCI6MTY0NTY3MTkyOH0.
0HfMiRxgS-fQ1fR-q6wRTe1MSAfiSHipNFGeeZLhWJQ  */


//super admin token :eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyMTQxMzZlMzEzZDkwN2UzNDVhNDRjYiIsImVtYWlsIjoibWF5b0BnbWFpbC5jb20iLCJpYXQiOjE2NDU2Njg2OTgsImV4cCI6MTY0NTY3MjI5OH0.pZxIi2y3uyYEok6Dm_NAQISXXIcj6L2AxiRh4px3qfA 