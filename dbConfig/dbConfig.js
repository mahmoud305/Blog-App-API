const mongoose = require('mongoose');

const dataBaseConfig = () => {
    mongoose.connect(process.env.MONGO_ATLAS_CONNECTION_LINK).
        then(console.log("DataBase Connected Successfully")).
        catch((error) => { console.log("error in connecting the databse \n", error); })
}
module.exports= dataBaseConfig;