var express = require('express');
var router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const passport = require('passport');
const {ensureAuthenticated} = require('../config/auth');
const mail = require('../config/mail');
const makeID = require('../config/makeID');

router.get('/login', function(req, res, next){
    res.render('login');
});

router.post('/register', (req, res, next) => {
    const {firstname, lastname, username, phone, password, password2} = req.body;
    let errors = [];
    if(!firstname || !username || !phone || !password || !password2){
        errors.push({msg: "لطفا موارد خواسته شده را تکمیل نمایید."})
    }
    if(password !== password2){
        errors.push({msg: "تایید رمز عبور صحیح نمیباشد."});
    }
    if(password.length < 6){
        errors.push({msg: "رمز عبور باید بیش از ۶ حرف باشد."})
    }
    if(errors.length > 0){
        res.render('login', {
            errors,
            username,
            phone,
            firstname,
            lastname
        });
    }else{
        const fullname = firstname + ' ' + lastname;
        User.findOne({username: username})
        .then(user => {
            if(user){
                errors.push({msg: "از این نام کاربری قبلا استفاده شده."});
                res.render('login', {
                    errors, phone
                });
            }else {
                const newUser = new User({fullname, firstname, lastname, username, phone, password});
                console.log('New User Registerd:' + newUser);
                bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) throw err;
                    newUser.password = hash;
                    newUser.save()
                    .then(user => {
                        req.flash('success_msg', 'ثبت نام با موفقیت انجام شد.');
                        res.redirect('/user/login');
                        mail(newUser.username, 'به شاتر خوش آمدید', 'به شاتر خوش آمدید.');
                    })
                    .catch(err => console.log(err));
                }));
            }
        }).catch(err => console.log(err));
    }
});

router.post('/login', (req, res, next)=>{
    passport.authenticate('local', {
        successRedirect: '/dashboard?login=true',
        failureRedirect: '/user/login',
        failureFlash: true
      })(req, res, next);
});

router.get('/logout', (req, res, next)=>{
    req.logOut();
    req.flash('success_msg', 'شما با موفقیت خارج شدید');
    res.redirect('/user/login');
});

router.get('/translator-register', (req, res, next) => {
    // res.render('./user/translator-code');
    res.render('./user/translator-register');
});

router.post('/verify-code', (req, res, next) => {
    console.log(req.body);
    res.render('./user/translator-register');
});
router.post('/translator-register', (req, res, next) => {
    var {firstName, lastName, baseLangs, destLangs, day, month, year, passNumber, sex, phone, phoneback, creditNum, password, passwordconf, username} = req.body;
    var errors = [];
    if(!firstName || !lastName || !baseLangs || !destLangs || !day || !month || !year || !passNumber || !sex || !phone || !creditNum || !password || !passwordconf || !username){
        errors.push({msg: 'لطفا موارد خاسته شده را تکمیل نمایید.'});
    }
    else{
        if(day > 31 || month > 12 || year < 1300 || year >1410){
            errors.push({msg: 'لطفا تاریخ تولد را به درستی وارد نمایید.'});
        }
        if(passNumber.length != 10){
            errors.push({msg: 'لطفا شماره شناسنامه را به درستی وارد نمایید.'});
        }
        console.log(creditNum.substr(0, 5));
        if(creditNum.substr(0, 6) != '610433'){
            errors.push({msg: 'لطفا شماره کارت بانک ملت خود را وارد نمایید.'});
        }
        if(password != passwordconf){
            errors.push({msg: 'تایید رمز عبور صحیح نمی باشد.'});
        }
        if(password.length < 6){
            errors.push({msg: "رمز عبور باید بیش از ۶ حرف باشد."})
        }    
    }
    if(errors.length > 0){
        res.render('./user/translator-register', {
            errors,
            firstName, lastName, baseLangs, destLangs, day, month, year, passNumber, sex, phone, creditNum, phoneback
        });
    }else{
        const fullname = firstName + ' ' + lastName;
        User.findOne({username: username}).then(user => {
            if(user){
                errors.push({msg: "از این نام کاربری قبلا استفاده شده."});
                res.render('./user/translator-register', {
                    errors,
                    firstName, lastName, baseLangs, destLangs, day, month, year, passNumber, sex, phone, creditNum, phoneback
                });
            }else {
                const code = 'M' + makeID(4);
                const newUser = new User({active: false, fullname, firstname: firstName, lastname: lastName, username, phone, password, baseLangs, destLangs, day, month, year, passNumber, sex, phoneback, creditNum, role: 'translator', code});
                bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) throw err;
                    newUser.password = hash;
                    newUser.save().then(user => {
                        console.log('New User Registerd:' + newUser);
                        req.flash('success_msg', 'ثبت نام با موفقیت انجام شد.');
                        res.redirect('/user/login');
                    })
                    .catch(err => console.log(err));
                }));
            }
        }).catch(err => console.log(err));
    }
});

module.exports = router;


