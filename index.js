
/**
 * author : Mahmoud Abo-Hgr .
 * Group : Friday 10-->4 
 * Final Exam
 * Backend Node.js
 * 
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
// app.get('*', (req, res) => {
//     res.sendFile(`index.html`, { root: www });
// });
app.listen(port, () => console.log(`listening on http://localhost:${port}`));
