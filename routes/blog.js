var express = require('express');
var router = express.Router();
const {ensureAuthenticated} = require('../config/auth');
const Content = require('../models/Content');
const { route } = require('.');
const { findOneAndRemove } = require('../models/Content');
const { query } = require('express');

router.get('/home', function(req, res, next){
    if(!req.user){
        Content.find({}, (err, contents)=>{
            res.render('./blog/home', {
                user: false,
                contents
            });
        });
    } 
    else{
        Content.find({}, (err, contents)=>{
            res.render('./blog/home', {
                user: req.user,
                contents
            });
        });
    }
});

router.get('/category', function(req, res, next){
    if(!req.user){
        Content.find({category: req.query.category}, (err, contents)=>{
            res.render('./blog/category', {
                user: false,
                contents,
                category: req.query.category
            });
        });
    } 
    else{
        Content.find({category: req.query.category}, (err, contents)=>{
            res.render('./blog/category', {
                user: req.user,
                contents,
                category: req.query.category
            });
        });
    }
});

router.get('/content', function(req, res, next){
    if(!req.user){
        Content.findById(req.query.id, (err, content)=>{
            Content.find({}, (err, contents)=>{
                // console.log(content);
                res.render('./blog/content', {
                    user: false,
                    content,
                    contents
                });
            });
            var view = content.view + 1;
            Content.updateOne({_id: content._id}, {$set: {view}}, (err)=>{
                if(err) console.log(err);
            });
        });
    } 
    else{
        Content.findById(req.query.id, (err, content)=>{
            Content.find({}, (err, contents)=>{
                res.render('./blog/content', {
                    user: req.user,
                    content,
                    contents
                });
            });
            var view = content.view + 1;
            Content.updateOne({_id: content._id}, {$set: {view}}, (err)=>{
                if(err) console.log(err);
            });
        });
    }
});
router.get('/add', ensureAuthenticated, function(req, res, next){
    Content.find({}, (err, contents)=>{
        if(!req.user){
            res.render('./blog/add-content', {
                user: false,
                contents
            });
        } 
        else if(req.user.role === 'user'){
            res.render('./blog/add-content', {
                user: req.user,
                contents
            });
        }
        else{
            res.render('./blog/add-content', {
                user: req.user,
                contents
            });
        }
    });
});

router.get('/remove', ensureAuthenticated, function(req, res, next){
    Content.findOneAndRemove({_id: req.query.id}, (err, content)=>{
        res.redirect('/blog/home');
    });
});

router.get('/star', function(req, res, next){
    var star = parseInt(req.query.rate);
    Content.findById(req.query.id, (err, content)=>{
        star = (content.star * content.rateNum + star) / (content.rateNum+1);
        content.rateNum++;
        Content.updateMany({_id: req.query.id}, {$set: {rateNum: content.rateNum, star: star}}).then(duc=>{
            res.redirect(`/blog/content?id=${req.query.id}`);
        }).catch(err=>{if(err) console.log(err)});
    });
});

router.post('/comment', (req, res, next)=>{
    var newComment = req.body;
    if(!newComment.Email || !newComment.fullName)
        res.send('موارد خواسته شده را کامل کنید.')
    else{
        newComment.date = Date.now();
        Content.findById(newComment.id, (err, content)=>{
            if(err) console.log(err);
            content.comment.push(newComment);
            Content.updateMany({_id: content._id}, {$set: {comment: content.comment}}).then(doc =>{
                res.redirect(`/blog/content?id=${content._id}`);
            }).catch(err=>{
                if(err) console.log(err);
            });
        });
    }
});

router.post('/add-paragraph', (req, res, next)=>{
    const {id, text} = req.body;
    if(req.user.role == 'contentor' || req.user.role == 'admin'){
        Content.findById(id, (err, content)=>{
            var newContent = content.content;
            newContent.push({type: 'text', text: text});
            Content.updateMany({_id: id}, {$set: {content: newContent}}).then(content => {
                res.redirect(`/blog/content?id=${id}`);
            }).catch(err => {
                if(err) console.log(err)
            });
        });
    }
});
router.post('/add-title', (req, res, next)=>{
    const {id, title} = req.body;
    if(req.user.role == 'contentor' || req.user.role == 'admin'){
        Content.findById(id, (err, content)=>{
            var newContent = content.content;
            newContent.push({type: 'title', title: title});
            Content.updateMany({_id: id}, {$set: {content: newContent}}).then(content => {
                res.redirect(`/blog/content?id=${id}`);
            }).catch(err => {
                if(err) console.log(err)
            });
        });
    }
});

router.get('/remove-part', (req, res, next)=>{
    const {id, index} = req.query;
    if(req.user.role == 'contentor' || req.user.role == 'admin'){
        Content.findById(id, (err, content)=>{
            var newContent = content.content;
            newContent.splice(index, 1);
            Content.updateMany({_id: id}, {$set: {content: newContent}}).then(content => {
                res.redirect(`/blog/content?id=${id}`);
            }).catch(err => {
                if(err) console.log(err)
            });
        });
    }
});

module.exports = router;