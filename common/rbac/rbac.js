const {ROLES}= require("./../enum/systemRoles");
const superAdminPolicy= require("./superAdminPolicy");
const adminPolicy = require("./adminPolicy");
const userPolicy= require("./userPolicy");
const RBAC = require("easy-rbac");

const systemOptions={
    [ROLES.SUPERADMIN]:{can:superAdminPolicy},
    [ROLES.ADMIN]:{can:adminPolicy},
    [ROLES.USER]:{can:userPolicy}

}

const rbac =RBAC.create(systemOptions);

module.exports=rbac;