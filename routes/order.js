var express = require('express');
var router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const passport = require('passport');
const Translation = require('../models/Translation');
const {ensureAuthenticated} = require('../config/auth');
const mail = require('../config/mail');
const makeID = require('../config/makeID');

router.get('/register', function(req, res, next){
    if(req.user){
        res.render('./order/information', {
            user: req.user
        });
    }else{
        res.render('./order/register');
    }
});
router.post('/register', function(req, res, next){
    const {firstname, lastname, username, phone, password, password2} = req.body;
    let errors = [];
    if(!firstname || !lastname || !username || !phone || !password || !password2){
        errors.push({msg: "لطفا موارد خواسته شده را تکمیل نمایید."})
    }
    if(password !== password2){
        errors.push({msg: "تایید رمز عبور صحیح نمیباشد."});
    }
    if(password.length < 6){
        errors.push({msg: "رمز عبور باید بیش از ۶ حرف باشد."})
    }
    if(errors.length > 0){
        res.render('./order/register', {
            errors, firstname, lastname, username, phone
        });
    }
    else{
        User.findOne({username: username}, function(err, user){
            if(user){
                errors.push({msg: "از این نام کاربری قبلا استفاده شده."});
                res.render('./order/register', {
                    errors, firstname, lastname, username, phone
                });
            }
            else{
                var fullname = firstname + ' ' + lastname;
                const newUser = new User({firstname, lastname, fullname, username, phone, password});
                bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) throw err;
                    newUser.password = hash;
                    newUser.save()
                    .then(user => {
                        req.flash('success_msg', 'ثبت نام با موفقیت انجام شد.');
                        passport.authenticate('local', {
                            successRedirect: '/order/information',
                            failureRedirect: '/user/login',
                            failureFlash: true
                          })(req, res, next);
                        // res.redirect('/order/information');
                    })
                    .catch(err => console.log(err));
                }));
            }
        });
    }
});

router.get('/information', ensureAuthenticated, function(req, res, next){
    res.render('./order/information', {
        user: req.user
    });
});
router.post('/information', ensureAuthenticated, function(req, res, next){
    const {title, baseLanguage, destLanguage, time, description} = req.body;
    let errors = [];
    if(!title || !baseLanguage || !destLanguage || !time){
        errors.push({msg: "لطفا موارد خواسته شده را تکمیل نمایید."})
    }
    if((baseLanguage == destLanguage) || ((baseLanguage == 'انگلیسی (طلائی)' || baseLanguage == 'انگلیسی (نقره ای)' || baseLanguage == 'انگلیسی (برنزی)') && (destLanguage == 'انگلیسی (طلائی)' || destLanguage == 'انگلیسی (نقره ای)' || destLanguage == 'انگلیسی (برنزی)'))){
        errors.push({msg: "زبان مبداء و مقصد نمی توانند مشابه باشند."});
    }
    if(errors.length > 0){
        res.render('./order/information', {
            errors, title, baseLanguage, destLanguage, time, description, user: req.user
        });
    }
    else{
        const code = 'S' + makeID(4);
        const newTranslation = new Translation({
            title,
            baseLanguage,
            destLanguage,
            time,
            description,
            username: req.user.username,
            phone: req.user.phone,
            code
        });
        newTranslation.save().then(translation =>{
            res.redirect(`/order/upload?id=${translation._id}`);
            mail(req.user.username, 'ثبت سفارش ترجمه', `با سلام \nسفارش شما به کد پیگیری ${code} در دست بررسی توسط اپراتور است و در اسرع وقت ایمیلی حاوی اطلاعات بیشتر، لینک پرداخت و موارد تکمیلی برایتان ارسال خواهد شد. پس از پرداخت، سفارش شما در اختیار مترجمان و در دستور کار قرار خواهد گرفت.\nبا آرزوی توفیق برای شما💙`);
        }).catch(err => console.log(err));
    }

});

router.get('/upload', ensureAuthenticated, function(req, res, next){
    res.render('./order/upload', {
        user: req.user,
        id: req.query.id
    });
});

router.get('/finish', ensureAuthenticated, function(req, res, next){
    res.render('./order/finish', {
        user: req.user
    });
});



module.exports = router;