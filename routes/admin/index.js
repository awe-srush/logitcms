const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const Comment = require('../../models/Comment');
const Category = require('../../models/Category');

const {userAuthenticated}=require('../../helpers/authentication');

//override default layout
router.all('/*',userAuthenticated, (req,res,next)=>{
  req.app.locals.layout = 'admin';
  next();
});

router.get('/', (req,res)=>{

  const promises = [

        Post.countDocuments().exec(),
        Category.countDocuments().exec(),
        Comment.countDocuments().exec()

    ];


    Promise.all(promises).then(([postCount, categoryCount, commentCount])=>{


        res.render('admin/index', {postCount: postCount, categoryCount: categoryCount, commentCount: commentCount});

});

});






module.exports = router;
