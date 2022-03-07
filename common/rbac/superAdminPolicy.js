const { ADD_ADMIN, GET_ADMIN_LIST, DELETE_ADMIN } = require("../../src/User/userEndPoints");
const adminPolicy= require("./adminPolicy");


const superAdminPolicy=[ADD_ADMIN, GET_ADMIN_LIST , DELETE_ADMIN];

module.exports=superAdminPolicy.concat(adminPolicy);// super admin is normal admin with more privileges.
