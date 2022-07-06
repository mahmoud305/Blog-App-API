# Blog App API
this is a multi-user blogging application with __Nodejs__ for backend developing and __MongoDB.__
### this API is deployed using [Heroku](https://blog-user-posts-app3.herokuapp.com/)


#### Table of Contents:
- [About The Project](#about-the-project)
- [Built With](#built-with)
- [Getting Started](#getting-started)
- [API EndPoints](#api-endpoints)
- [Contact](#contact)

# About the Project
A blog API with system users:
1. User
2. Admin
3. Super Admin

Where user can add posts and view other users posts.

<p align="right">(<a href="#blog-app-api">back to top</a>)</p>

# Built With
* Back-End API services: __NodeJS__ using ExpressJS library.
* DataBase: __MongoDB__, deployed on Mongo Atlas. 
<p align="right">(<a href="#blog-app-api">back to top</a>)</p>

# Getting Started
You can use the Blog Api that is deployed in heroku where the base url is <br>
### https://blog-user-posts-app3.herokuapp.com/ <br>
__*OR*__ To launch the backend in the your localhost, clone the repository and install the project modules
```bash
npm install
```
then map the .env file to your enviroment here is an example for it 
```env
PORT=5000
DATABASE_CONNECTION_LINK=mongodb://localhost:27017/BlogDB
MONGO_ATLAS_CONNECTION_LINK=mongodb+srv://userName:<password>@cluster0.cwllh.mongodb.net/blog?retryWrites=true&w=majority

ENCRYPTION_SECRUITY_KEY=y6RyHvF7eStC55xc2CJRc6Ss0rlG2WoA
ENCRYPTION_INIT_VECTOR=db92a6c2624728444e1feab358b13c71
ENCRYPTION_ALGORITHM=aes-256-cbc

JWT_SECREET_KEY=mayo
EMAIL_SENDER=ma5027300@gmail.com
EMAIL_SENDER_PASS=**********
```
#### Note : 
you have to sign in to get a user token that you will add it to any request to the api -add it to authorization in a Bearer Token type-  
<p align="right">(<a href="#blog-app-api">back to top</a>)</p>

# API EndPoints
#### Note : 
you have to sign in to get a user token that you will add it to any request to the api -add it to authorization in a Bearer Token type-  
every system user has his own features as:
#### 1. User
* SIGN_UP (/signup)
__Register with a valid email as you will not be ale to sign in except if you verified your email.__
``` json
{
    "name":"user",
    "email":"ba384c0aec@dragonmail.live",
    "password": "user"  ,
    "cPassword":"user",
    "phone":"01100113935",
    "location":"Cairo Giza"
}
```
* SIGN_IN (/signin)
```json
{
    "email":"ma5027300@gmail.com",
    "password":"mayo"
}
```
* FORGET_PASSWORD (/forgetPassword)
```json
{
    "email":"ma5027300@gmail.com"
}
```
* UPDATE_PROFILE_HANDLER (/updateUser)
```json
{
    "name":"Mahmoud",
    "location":"Dokki ,Cairo"
}
```
* UPDATE_USER_PASSWORD (/updateUserPassword/:id)
```json
{
    "oldPassword":"MahomudPassword",
    "newPassword":"MayoPassword",
    "cNewPassword":"MayoPassword"
}
```
* DEACTIVATE_USER_ACCOUNT (/dectivateUserAccount/:id)

* ADD_POST (/addPost)
```json
{
    "title":" user Post 1",
    "desc":"description of user post  is here "
}
```
* EDIT_POST (/editPost/:postId)
```json
{
    "title":" updated Post 14",
    "desc":"description  222222 "
}
```
* REPORT_POST (/reportPost)
```json
{
    "postID": "6226324eb239dc73b17052b3",
    "comment":" this is not a normal post it shit post on77777e." 
}
```
* GET_PROFILE_POSTS (/getProfilePosts/:userId)

* DELETE_POST (/deletePost/:postId)

* GET_ALL_USERS_POSTS (/getAllUsersPosts)

#### 2. Admin 
* BLOCK_USER_ACCOUNT (/blockUserAccount/:id)
* UPDATE_USER_PASSWORD (/updateUserPassword/:id)
```json
{
    "oldPassword":"MahomudPassword",
    "newPassword":"MayoPassword",
    "cNewPassword":"MayoPassword"
}
```
* DEACTIVATE_USER_ACCOUNT (/dectivateUserAccount/:id)
* UPDATE_PROFILE_HANDLER (/updateUser)
```json
{
    "name":"Mahmoud",
    "location":"Dokki ,Cairo"
}
```
* GET_ALL_USERS (/getAllUsers)
* GET_ALL_POSTS (/getAllPosts)
* GET_REPORTED_POSTS (/reviewReportedPosts)
* GET_PROFILE_POSTS (/getProfilePosts/:userId)
* BLOCK_POST (blockPost/:postId)
* ADD_POST (/addPost)
* DELETE_POST (/deletePost/:postId)

#### 3. Super Admin 
__has all the admin functions besides its own functions__ .
* ADD_ADMIN (/addAdmin)
```json
{
    "name":"Mahmoud",
    "email":"ma5027300@gmail.com",
    "password": "mayo"  ,
    "cPassword":"mayo",
    "phone":"01102488789",
    "location":"Cairo Egypt"

}
```
* GET_ADMIN_LIST (/getAdminList)
* DELETE_ADMIN (/deleteAdminAccount/:id)

#### Note : 
all the get request can apply pagination by passing __pageSize__ , __pageNum__ as a parameters in query
<p align="right">(<a href="#blog-app-api">back to top</a>)</p>
__add what between brackets to the [base URL](#base-url) to use this endpoint__

# Contact
* Email: ma5027300@gmail.com.
* LinkedIn: http://linkedin.com/in/mahmoudabohagr5027300
* Phone: +02-01102488789.


#### It's my pleasure to hear your feedback ☀️😊.
<p align="right">(<a href="#blog-app-api">back to top</a>)</p>


