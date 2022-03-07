
/**
 * author : Mahmoud Abo-Hgr .
 * Backend Node.js
 * DataBase: MongoDB -NoSQL-. 
 */

const express = require('express');
const app = express();
app.use(express.json()); 
require("dotenv").config();
const port = process.env.PORT || 4000 ;
const dbConnection= require("./dbConfig/dbConfig");
const postRouter = require('./src/Post/postRouter/postRouter');
const userRouter = require('./src/User/userRouter/userRouter');

app.use(userRouter);
app.use(postRouter);

dbConnection();
app.get('/', (req, res) => {
    res.send(`<h1 style="text-align:center"> Welcome in Blog API</h1>`);
});
app.listen(port, () => console.log(`listening on http://localhost:${port}`));
