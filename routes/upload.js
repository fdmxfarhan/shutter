var express = require('express');
var path = require('path');
var router = express.Router();
var bodyparser = require('body-parser');
const multer = require('multer');
const Translation = require('../models/Translation');
const {ensureAuthenticated} = require('../config/auth');
const Content = require('../models/Content');
const User = require('../models/User');
router.use(bodyparser.urlencoded({extended: true}));
const mail = require('../config/mail');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/files')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname + Date.now().toString())
    }
});

var upload = multer({ storage: storage });

router.post('/order', ensureAuthenticated, upload.single('myFile'), (req, res, next) => {
    const text = req.body.text;
    const id = req.body.id;
    const fileName = req.file.originalname;
    Translation.updateMany({_id: id}, { $set: { file: fileName, text: text } }, function(err){
        if(err) throw err;
        res.redirect('/order/finish')
    });
});

router.post('/translator', ensureAuthenticated, upload.single('myFile'), (req, res, next) => {
    const text = req.body.text;
    const id = req.body.id;
    const fileName = req.file.originalname;
    Translation.updateMany({_id: id}, {$set: {translatedFile: fileName, translatedText: text, done: true, status: 'ترجمه شده'}}, function(err){
        res.redirect(`/dashboard/edit-request?id=${id}`)
    });
    Translation.findById(id, (err, translation)=>{
        mail(translation.username, 'تکمیل سفارش', `خوشحالیم که به اطلاع برسونیم، سفارش شما تکمیل شده و از طریق این لینک قابل دریافت است http://shutterco.ir/dashboard/order?id=${translation._id} کلیه سفارشات تا سه روز ضمانت کیفیت دارند و در صورت وجود مشکل میتوانید آن را با پشتیبانی مطرح کنید. و نیز چنانچه از سفارش کاملا راضی بودید میتوانید دکمه رضایت کامل از سفارش را دارم را بزنید تا دستمزد به حساب مترجم واریز شود. پاسخ گویی شما به سوالات نظر سنجی قطعا یاریگر ما در ارائه خدمات بهتر خواهد بود\nبا آرزوی توفیق برای شما💙`);
        // setTimeout(()=>{
        //     mail(translation.username, 'تکمیل', '');
        // }, 1000 * 60 * 60 * 24 * 3);
    });
});

router.post('/add-content',ensureAuthenticated , upload.single('photo'), (req, res, next)=>{
    // console.log(req.body);
    var {title, category, image1, metadsc, URL} = req.body;
    var photo = req.file.originalname;
    var author = req.user.username;
    console.log({title, category, image1, photo, metadsc, URL});
    if(req.user.role == 'admin' || req.user.role == 'contentor'){
        var newCnotent = new Content({title, category, image1, photo, metadsc, URL, author});
        newCnotent.save().then(content => {
            res.redirect('/blog/home');
        }).catch(err => console.log(err));
    }
});

router.post('/push-image',ensureAuthenticated , upload.single('photo'), (req, res, next)=>{
    const {id} = req.body;
    var photo = req.file.originalname;
    if(req.user.role == 'contentor' || req.user.role == 'admin'){
        Content.findById(id, (err, content)=>{
            var newContent = content.content;
            newContent.push({type: 'image', photo: photo});
            Content.updateMany({_id: id}, {$set: {content: newContent}}).then(content => {
                res.redirect(`/blog/content?id=${id}`);
            }).catch(err => {
                if(err) console.log(err)
            });
        });
    }
});


router.post('/translator/agreement1',ensureAuthenticated , upload.single('myFile'), (req, res, next)=>{
    const fileName = req.file.originalname;
    User.findById(req.user._id, (err, user) =>{
        var agreement;
        if(user.agreement) agreement = user.agreement;
        else    agreement = {};
        agreement.uploaded1 = true;
        agreement.file1 = fileName;
        User.updateMany({username: req.user.username}, {$set: {agreement: agreement}}).then(doc => {
            res.redirect('/dashboard/translator-documents');
        }).catch(err => {if(err) console.log(err)});
    });
});

router.post('/translator/agreement2',ensureAuthenticated , upload.single('myFile'), (req, res, next)=>{
    const fileName = req.file.originalname;
    User.findById(req.user._id, (err, user) =>{
        var agreement;
        if(user.agreement) agreement = user.agreement;
        else    agreement = {};
        agreement.uploaded2 = true;
        agreement.file2 = fileName;
        User.updateMany({username: req.user.username}, {$set: {agreement: agreement}}).then(doc => {
            res.redirect('/dashboard/translator-documents');
        }).catch(err => {if(err) console.log(err)});
    });
});

router.post('/translator/agreement3',ensureAuthenticated , upload.single('myFile'), (req, res, next)=>{
    const fileName = req.file.originalname;
    User.findById(req.user._id, (err, user) =>{
        var agreement;
        if(user.agreement) agreement = user.agreement;
        else    agreement = {};
        agreement.uploaded3 = true;
        agreement.file3 = fileName;
        User.updateMany({username: req.user.username}, {$set: {agreement: agreement}}).then(doc => {
            res.redirect('/dashboard/translator-documents');
        }).catch(err => {if(err) console.log(err)});
    });
});

router.post('/translator/idCard',ensureAuthenticated , upload.single('myFile'), (req, res, next)=>{
    const fileName = req.file.originalname;
    const idCard = {uploaded: true, file: fileName};
    User.updateMany({username: req.user.username}, {$set: {idCard: idCard}}).then(doc => {
        res.redirect('/dashboard/translator-documents');
    }).catch(err => {if(err) console.log(err)});
});



module.exports = router;






