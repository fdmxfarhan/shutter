var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Translation = require('../models/Translation');
const Payment = require('../models/Payment');
const Content = require('../models/Content');
const Ticket = require('../models/Ticket');
const Offcode = require('../models/Offcode');
const {ensureAuthenticated} = require('../config/auth');
const mail = require('../config/mail');
const makeID = require('../config/makeID');

var shamsi = function(date){
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    var kabise = Math.floor((year-1)/4);
    var kabise2 = Math.floor((year - (2020 - 1399) - 1)/4);
    var month2day = [31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365];
    var daySum = (year-1)*365 + (month2day[month - 2]) + day - 226899 + kabise - kabise2;
    year = Math.floor(daySum/365) + 1;
    var monthSum = [31, 62, 93, 142, 155, 186, 216, 246, 276, 306, 336, 365];
    for(var i=0; i<12; i++){
        if(daySum%365 < monthSum[i]){
            month = i + 1;
            break;
        }
    }
    day = (daySum%365) - monthSum[month - 2] + 1;
    return(`${year}, ${month}, ${day}`);
};

router.get('/', ensureAuthenticated, function(req, res, next){
    var messages = [];
    if(!req.user){
        res.redirect('user/login');
    } 
    else if(req.user.role === 'user'){
        Translation.find({username: req.user.username}, function(err, translations){
            if(req.query.login) messages.push({msg: 'به پنل کاربری خود خوش آمدید.'});
            var cnt = 0;
            for(var i=0; i<translations.length; i++){
                if(translations[i].payed == false && translations[i].status != 'در حال بررسی') cnt++;
            }
            if(cnt > 0) messages.push({msg: `شما ${cnt} سفارش پرداخت نشده دارید. توجه داشته باشید که پیش از پرداخت هزینه، ترجمه انجام نخواهد شد.`});
            Ticket.find({username: req.user.username}, (err, tickets)=>{
                var active = {translationRequest: false, payments: false, ticket: false};
                for(var i=0; i<tickets.length; i++){
                    for(var j=0; j<tickets[i].answers.length; j++){
                        if(tickets[i].answers[j].username != req.user.username && tickets[i].answers[j].seen == false){
                            messages.push({msg: `تیکت شما با موضوع ${tickets[i].subject} پاسخ داده شد.`});
                            active.ticket = true;
                        }
                    }
                }
                
                res.render('./dashboard/user-dashboard', {
                    user: req.user,
                    translations,
                    messages,
                    active
                });
            });
        });
    }
    else if(req.user.role === 'admin'){
        User.find({}, (err, docs) => {
            Translation.find({}, (err, translations)=>{
                Ticket.find({username: req.user.username}, (err, tickets)=>{
                    var active = {translationRequest: false, payments: false, ticket: false};
                    for(var i=0; i<tickets.length; i++){
                        for(var j=0; j<tickets[i].answers.length; j++){
                            if(tickets[i].answers[j].username != req.user.username && tickets[i].answers[j].seen == false) 
                                messages.push({msg: `تیکت شما با موضوع ${tickets[i].subject} پاسخ داده شد.`});
                                active.ticket = true;
                        }
                    }
                    res.render('./dashboard/admin-dashboard', {
                        user: req.user,
                        users: docs,
                        translations,
                        messages,
                        active
                    });
                });
            });
        });
    }
    else if(req.user.role === 'translator'){
        Translation.find({}, (err, translations) => {
            if(err) throw err;
            var income = 0;
            var count = 0;
            for(var i=0; i<translations.length; i++){
                if(translations[i].translator == req.user.username){
                    if(translations[i].status == 'ترجمه شده'){
                        count++;
                        income += translations[i].price;
                    }
                }
            }
            res.render('./dashboard/translator-dashboard', {
                user: req.user,
                translations,
                count,
                income
            });
        });
    }
    else if(req.user.role === 'contentor'){
        Content.find({author: req.user.username}, (err, contents)=>{
            res.render('./dashboard/contentor-dashboard', {
                user: req.user,
                contents
            });
        });
    }
});

router.get('/acount', ensureAuthenticated, function(req, res, next){
    if(!req.user){
        res.redirect('user/login');
    } else if(req.user.role === 'user'){
        res.render('./dashboard/acount', {
            user: req.user
        });
    }
});

router.get('/upgrade-user', ensureAuthenticated, function(req, res, next){
    if(req.user.role == 'admin'){
        User.findOne({username: req.query.username}, function(err, doc){
            if(doc){
              var active = { payment: false, reports: false, comments: false};
              res.render('./dashboard/upgrade-user', {
                uname: req.user.uname,
                upgradeUser: doc,
                user: req.user,
                active: active
              });
              
            }
        });
    }
});

router.get('/upgradetoadmin', ensureAuthenticated, function(req, res, next){
    if(req.user.role === 'admin'){
        User.findOne({username: req.query.username}, function(err, doc){
            User.updateMany({_id: doc._id}, { $set: { role: 'admin' } }, function(err){
                if(err) console.log(err);
                else res.redirect('/dashboard');
                mail(doc.username, 'تغییر نقش کاربری', `نقش کاربری شما به ادمین تغییر کرد.`);
            });
        });
    }
    else{
        res.redirect('/register/login');
    }
});
router.get('/upgradetotranslator', ensureAuthenticated, function(req, res, next){
    if(req.user.role === 'admin'){
        User.findOne({username: req.query.username}, function(err, doc){
            User.updateMany({_id: doc._id}, { $set: { role: 'translator' } }, function(err){
                if(err) console.log(err);
                else res.redirect('/dashboard');
                mail(doc.username, 'تغییر نقش کاربری', `نقش کاربری شما به مترجم تغییر کرد.`);
            });
        });
    }
    else{
        res.redirect('/register/login');
    }
});
router.get('/upgradetouser', ensureAuthenticated, function(req, res, next){
    if(req.user.role === 'admin'){
        User.findOne({username: req.query.username}, function(err, doc){
            User.updateMany({_id: doc._id}, { $set: { role: 'user' } }, function(err){
                if(err) console.log(err);
                else res.redirect('/dashboard');
                mail(doc.username, 'تغییر نقش کاربری', `نقش کاربری شما به کاربر عادی تغییر کرد.`);
            });
        });
    }
    else{
        res.redirect('/register/login');
    }
});

router.get('/upgradetocontentor', ensureAuthenticated, function(req, res, next){
    if(req.user.role === 'admin'){
        User.findOne({username: req.query.username}, function(err, doc){
            User.updateMany({_id: doc._id}, { $set: { role: 'contentor' } }, function(err){
                if(err) console.log(err);
                else res.redirect('/dashboard');
                mail(doc.username, 'تغییر نقش کاربری', `نقش کاربری شما به مدیر محتوا تغییر کرد.`);
            });
        });
    }
    else{
        res.redirect('/register/login');
    }
});

router.get('/removeuser', ensureAuthenticated, function(req, res, next){
    if(req.user.role === 'admin'){
        User.deleteOne({_id: req.query.id}, (err)=>{
            if(err) console.log(err);
            else res.redirect('/dashboard');
        })
    }
    else{
        res.redirect('/register/login');
    }
});

router.get('/request', ensureAuthenticated, function(req, res, next){
    if(req.user.role == 'translator'){
        Translation.findById(req.query.id, function(err, translation){
            res.render('./dashboard/translator-request',{
                user: req.user,
                translation
            });
        });
    }
});

router.get('/accept-request', ensureAuthenticated, function(req, res, next){
    if(req.user.role == 'translator'){
        Translation.updateMany({_id: req.query.id}, { $set: { status: 'در حال ترجمه', translator: req.user.username } }, function(err, doc){
            if(err) console.log(err);
            res.redirect('/dashboard');
            Translation.findById(req.query.id, (err, translation) => {
                mail(Translation.username, 'سفارش شما در حال ترجمه است', `سفارش ترجمه شما توسط آقا/خانم ${req.user.lastname} برداشته شد\nپس از اتمام پروژه، ایمیلی برایتان ارسال خواهد شد و میتوانید از طریق پنل خود در سایت شاترسفارش را تحویل بگیرید\nبا آرزوی توفیق برای شما💙`);
            });
        });
    }
});

router.get('/edit-request', ensureAuthenticated, function(req, res, next){
    if(req.user.role == 'admin'){
        Translation.findById(req.query.id, function(err, translation){
            res.render('./dashboard/edit-request',{
                user: req.user,
                translation
            });
        });
    }else if(req.user.role == 'translator'){
        Translation.findById(req.query.id, function(err, translation){
            res.render('./dashboard/translator-edit-request',{
                user: req.user,
                translation
            });
        });
    }
});

router.post('/edit-request', ensureAuthenticated, function(req, res, next){
    if(req.user.role == 'admin'){
        Translation.updateMany({_id: req.body.id}, { $set: { 
            status: 'در انتظار مترجم',
            numberOfWords: req.body.numberOfWords, 
            numberOfPages: req.body.numberOfPages,
            price: req.body.salary,
            active: true
        }}, function(err, doc){
            Translation.findById(req.body.id, (err, translation)=>{
                User.findOne({username: translation.username}, function(err, user){
                    newPayment = new Payment({
                        fullname: user.fullname,
                        username: user.username,
                        phone: user.phone,
                        amount: req.body.price,
                        description: `پرداخت هزینه ترجمه ${translation.title}`,
                        date: Date.now(),
                        payed: false
                    });
                    newPayment.save().then(()=>{
                        Translation.updateMany({_id: req.body.id}, { $set: {paymentId: newPayment._id}}, (err, doc)=>{});
                        res.redirect(`/dashboard/edit-request?id=${req.body.id}`);
                        mail(translation.username, 'صورت حساب جدید', `صورت حساب جدید شما برای سفارش ${translation.title} ثبت گردید. شما می توانید از طریق لینک زیر صورت حساب های خود را مشاهده نمایید.\n http://shutterco.ir/dashboard/payments`);
                    }).catch((err)=> console.log(err));
                });
            });
        });
    }
});

router.get('/payments', ensureAuthenticated, function(req, res, next){
  if(req.user.role == 'user'){
    Payment.find({username: req.user.username},function(err, payments){
      var active = { payment: false, reports: false, comments: false};
      res.render('./dashboard/payments', {
        user: req.user,
        payments: payments,
        active: active
      });
    });
  }
  else if(req.user.role == 'admin'){
    User.find({}, function(err, users){
      Payment.find({},function(err, payments){
        var active = { payment: false, reports: false, comments: false};
        res.render('./dashboard/payments', {
          user: req.user,
          users: users,
          payments: payments,
          active: active
        });
      });
    });
  }
});

router.get('/remove', ensureAuthenticated, (req, res, nex)=> {
    const id = req.query.id;
    if(req.user.role == 'admin'){
        Payment.deleteOne({_id: id}).then(()=>{
            res.redirect('/dashboard/payments');
        });
    }
});

router.get('/order', ensureAuthenticated, function(req, res, next){
    Translation.findById(req.query.id, function(err, translation){
        res.render('./dashboard/order',{
            user: req.user,
            translation
        });
    });
});

router.get('/remove-order', ensureAuthenticated, function(req, res, next){
    Translation.findByIdAndDelete(req.query.id, function(err, doc){
        res.redirect('/dashboard');
        mail(doc.username, 'لغو سفارش', 'سفارش شما با موفقیت لغو شد. مبلغ پرداخت شده به حساب کاربری شما باز می گردد.')
    });
});

router.get('/ticket', ensureAuthenticated, (req, res, next) => {
    if(req.user.role == 'admin'){
        Ticket.find({}, (err, tickets) => {
            res.render('./dashboard/ticket', {
                user: req.user,
                tickets,
            });
        });
    }else{
        Ticket.find({username: req.user.username}, (err, tickets) => {
            res.render('./dashboard/ticket', {
                user: req.user,
                tickets
            });
        });
    }
});

router.get('/ticket/add', ensureAuthenticated, (req, res, next) => {
    res.render('./dashboard/add-ticket', {
        user: req.user
    });
});

router.post('/ticket/add', ensureAuthenticated, (req, res, next) => {
    console.log(req.body);
    const {fullname, email, subject, text} = req.body;
    var phone = req.user.phone;
    var username = req.user.username;
    var readBy = [{username: username}];
    const newTicket = new Ticket({email, fullname, username, phone, text, subject, readBy});
    newTicket.save().then(ticket => {
        res.redirect('/dashboard/ticket');
        mail(username, 'تیکت شما ثبت شد', 'تیکت شما با موفقیت ثبت شد و در انتظار پاسخ است.')
        User.find({role: 'admin'}, (err, admins) => {
            for(var i=0; i<admins.length; i++){
                mail(admins[i].username, 'تیکت جدید', `تیکت جدید توسط ${req.user.fullname} با نام کاربری ${username} با محتوای زیر ثبت شد.\n${text}`);
            }
        });
    }).catch(err => console.log(err));

});

router.get('/ticket/show', ensureAuthenticated, (req, res, next) => {
    var active = {translationRequest: false, payments: false, ticket: false};
    Ticket.findById(req.query.id, (err, ticket) => {
        for(var i=0; i<ticket.answers.length; i++){
            if(ticket.answers[i].username != req.user.username && ticket.answers[i].seen == false)
                active.ticket = true;
        }
        res.render('./dashboard/show-ticket', {
            user: req.user,
            ticket,
            shamsi,
            active
        });
        if(req.user.username == ticket.username){
            const answers = ticket.answers;
            for(var i=0; i<answers.length; i++)
                answers[i].seen = true;
            Ticket.updateMany({_id: req.query.id}, {$set: {answers}}, (err, ticket)=>{
                if(err) console.log(err);
            });
        }
    });
});

router.post('/ticket/answer', ensureAuthenticated, (req, res, next)=>{
    const {id, fullname, email, text} = req.body;
    Ticket.findById(id, (err, ticket)=>{
        var answers;
        if(ticket.answers) answers = ticket.answers;
        else              answers = [];
        var date = new Date(Date.now());
        answers.push({fullname, email, date, text, seen: false, username: req.user.username});
        Ticket.updateMany({_id: id}, {$set: {answers}}, (err, doc)=>{
            res.redirect(`/dashboard/ticket/show?id=${id}`);
            if(req.user.role != 'admin'){
                User.find({role: 'admin'}, (err, admins) => {
                    for(var i=0; i<admins.length; i++){
                        mail(admins[i].username, 'پاسخ تیکت', `تیکت با عنوان ${ticket.subject} توسط ${req.user.fullname} پاسخ داده شد.\n\n${text}`);
                    }
                });
            }
        });
    });
});

router.get('/edit-profile', ensureAuthenticated, (req, res, next)=>{
    res.render('./dashboard/editprofile', {
        user: req.user
    });
});

router.post('/edit-profile', ensureAuthenticated, (req, res, next)=>{
    const {firstname, lastname, phone, username} = req.body;
    User.updateMany({_id: req.user._id}, {$set: {firstname, lastname, phone, username}}).then((doc)=>{
        res.redirect('/dashboard/edit-profile');
    }).catch((err)=> console.log(err));
});

router.post('/edit-password', ensureAuthenticated, (req, res, next)=>{
    const {oldPassword, password, confPassword} = req.body;
    console.log(oldPassword);
    if(password.length >= 6 && password == confPassword && oldPassword){
        bcrypt.compare(oldPassword, req.user.password, function(err, isMatch){
            if(isMatch){
                bcrypt.genSalt(10, (err, salt) => bcrypt.hash(password, salt, (err, hash) => {
                    User.updateMany({_id: req.user._id}, {$set: {password: hash}}).then((doc)=>{
                        res.redirect('/dashboard/edit-profile');
                    }).catch((err)=> console.log(err));
                }));
            }
            else res.send('Password is not matched');
        });
    }
    else res.send('ERROR !!!!!!!!!!!!');
});

router.get('/offcode', ensureAuthenticated, (req, res, next) => {
    const defaultCode = 'Off' + makeID(5);
    Offcode.find({}, (err, offcodes)=>{
        if(req.user.role == 'admin'){
            res.render('./dashboard/offcode', {
                user: req.user,
                defaultCode,
                offcodes,
                shamsi
            });
        }
    });
});

router.post('/add-offcode', ensureAuthenticated, (req, res, next) => {
    var {code, startDay, startMonth, startYear, endDay, endMonth, endYear, ispercent, percent, price, allUsers, oneUser} = req.body;
    if (ispercent) ispercent = true;
    else           ispercent = false;
    if (allUsers) allUsers = true;
    else           allUsers = false;
    percent = Number(percent);
    price = Number(price);
    if(req.user.role == 'admin'){
        const startDate = new Date(startYear, startMonth, startDay, 0, 0, 0, 1);
        const endDate = new Date(endYear, endMonth, endDay, 0, 0, 0, 1);
        var userList = [];
        if (!allUsers) {
            User.find({}, (err, users)=>{
                for(var i=0; i<users.length; i++){
                    if(users[i].username != oneUser)
                        userList.push(users[i].username);
                }
                const newOffcode = new Offcode({code, startDate, endDate, percent, price, ispercent, userList});
                newOffcode.save().then(offcode => res.redirect('/dashboard/offcode')).catch(err => console.log(err));
            })
        }
        else{
            const newOffcode = new Offcode({code, startDate, endDate, percent, price, ispercent, userList});
            newOffcode.save().then(offcode => res.redirect('/dashboard/offcode')).catch(err => console.log(err));
        }
    }
});

router.get('/remove-offcode', ensureAuthenticated, (req, res, next) => {
    if(req.user.role == 'admin'){
        Offcode.deleteOne({_id: req.query.id}, err => {
            if(err) throw err;
            res.redirect('/dashboard/offcode');
        })
    }
});

router.get('/pre-factor', ensureAuthenticated, (req, res, next) =>{
    Payment.findById(req.query.id, (err, payment) =>{
        res.render('./dashboard/pre-factor', {
            user: req.user,
            payment
        });
    })
});

router.get('/translators', ensureAuthenticated, (req, res, next) =>{
    if(req.user.role == 'admin'){
        User.find({role: 'translator'}, (err, translators) =>{
            res.render('./dashboard/translators', {
                user: req.user,
                translators
            });
        });
    }
});

router.get('/translators-disactive', ensureAuthenticated, (req, res, next) => {
    if(req.user.role == 'admin'){
        User.updateMany({_id: req.query.id}, {$set: {confirmed: false}}).then(doc => {
            res.redirect('/dashboard/translators');
        }).catch(err => {if(err) console.log(err)});
    }
});

router.get('/translators-active', ensureAuthenticated, (req, res, next) => {
    if(req.user.role == 'admin'){
        User.updateMany({_id: req.query.id}, {$set: {confirmed: true}}).then(doc => {
            res.redirect('/dashboard/translators');
        }).catch(err => {if(err) console.log(err);});
    }
});

router.get('/translator-documents', ensureAuthenticated, (req, res, nex) => {
    if(req.user.agreement && req.user.idCard && req.user.agreement.uploaded1 && req.user.agreement.uploaded2 && req.user.agreement.uploaded3 && req.user.idCard.uploaded){
        User.updateMany({_id: req.user._id}, {$set: {applied: true}}).then(doc => {
            res.redirect('/dashboard');
        }).catch(err => {if(err) console.log(err)});
    }else{
        res.render('./dashboard/translator-documents', {
            user: req.user
        });
    }
})


module.exports = router;