var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var request = require('request');
const { ensureAuthenticated } = require('../config/auth');
const Payment = require('../models/Payment');
const User = require('../models/User');
const Translation = require('../models/Translation');
const mail = require('../config/mail');
const shamsi = require('../config/shamsi');
const Offcode = require('../models/Offcode');


router.post('/add', ensureAuthenticated, (req, res, nex)=> {
    const {username, amount, description} = req.body;
    if(req.user.role == 'admin'){
        User.findOne({username: username}, (err, doc)=>{
            if(doc){
                newPayment = new Payment({
                    fullname: doc.fullname,
                    username: doc.username,
                    phone: doc.phone,
                    amount: amount,
                    description: description,
                    date: Date.now(),
                    payed: false
                });
                newPayment.save()
                    .then(()=>{
                        res.redirect('/dashboard/payments');
                    }).catch((err)=> console.log(err));
            }
        });
    }
});
router.get('/remove', ensureAuthenticated, (req, res, nex)=> {
  const id = req.query.id;
  if(req.user.role == 'admin'){
    Payment.deleteOne({_id: id}).then(()=>{
      res.redirect('/payments');
    });
  }
});

router.post('/pay', function(req,res, next){
  Payment.findOne({_id: req.body.order_id}, (err, payment)=>{
    if(payment){
      var options2 = {
        method: 'POST',
        url: 'https://api.idpay.ir/v1.1/payment/verify',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': 'f965d744-79f0-456f-9b60-c8a4cfeeac59',
          // 'X-SANDBOX': 1,
        },
        body: {
          'id': req.body.id,
          'order_id': req.body.order_id,
        },
        json: true,
      };
      request(options2, function (error, response, body) {
        if (error) throw new Error(error);
        if(body.status == 100){
          Payment.updateMany({_id: payment._id}, { $set: { payed: true } }, function(err){
            if(err) console.log(err);
            res.render('./dashboard/success-pay', {
              payment: payment,
              payed: body
            });
            Translation.find({}, (err, translations) =>{
              for(var i=0; i< translations.length; i++){
                if(translations[i].paymentId == payment._id){
                  Translation.updateMany({_id: translations[i]._id}, {$set: {payed: true}}, function(err){
                    if(err) console.log(err);
                  });
                  var order = `
                    <style>h1,p:{direction: rtl; text-align: right;}</style>
                    <h1>با سلام</h1><br>
                    <p>صورت حساب شما با مبلغ ${body.amount}، به تاریخ ${shamsi(Date.now())} با موفقیت پرداخت شد.<p><br>
                    <h1>با آرزوی توفیق برای شما.<h1>`;
                  mail(translations[i].username, 'پرداخت سفارش', order);
                }
              }
            });
          });
        }
        else{
          res.render('./dashboard/fail-pay', {
            payment: payment
          });
        }
      });
    }
    else res.send('Error!!!!!!!!!!!');
  });
});

router.get('/pay', function(req, res, next){
  Payment.findOne({_id: req.query.id}, function(err, payment){
    var options = {
      method: 'POST',
      url: 'https://api.idpay.ir/v1.1/payment',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': 'f965d744-79f0-456f-9b60-c8a4cfeeac59',
        // 'X-SANDBOX': 1,
      },
      body: {
        'order_id': payment._id,
        'amount': payment.amount,
        'name': payment.fullname,
        'username': payment.username,
        'phone': payment.phone,
        'desc': payment.description,
        'callback': 'http://shutterco.ir/payment/pay',
        'reseller': null,
      },
      json: true,
    };
    request(options, function (error, response, body) {
      if (error) console.log(error);
      res.redirect(body.link);
    });  
  });
});
router.post('/pay-booklet', function(req,res, next){
  if(req.body.code == '1i3r9a8'){
    if(req.user){
      var newBooklet = new Booklet({uname: req.user.uname, name: req.body.name, price: req.body.price, payed: true});
      newBooklet.save().then((booklet)=>{
        res.render('./booklets/esp', {
          user: false,
          booklet
        });
      }).catch(err=>console.log(err));
    }
    else{
      var newBooklet = new Booklet({name: req.body.name, price: req.body.price, payed: true});
      res.render('./booklets/esp', {
        user: false,
        booklet: newBooklet
      });
    }
  }
  else if(req.user){
    var newBooklet = new Booklet({uname: req.user.uname, name: req.body.name, price: req.body.price, payed: false});
    newBooklet.save().then((booklet)=>{
      var options = {
        method: 'POST',
        url: 'https://api.idpay.ir/v1.1/payment',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': 'fe6a4553-cd95-4dff-af2e-80594c1c18c5',
          // 'X-SANDBOX': 1,
        },
        body: {
          'order_id': booklet._id,
          'amount': booklet.price,
          'name': req.user.fullname,
          'uname': req.user.uname,
          'phone': req.user.phone,
          'mail': req.user.email,
          'desc': req.body.name,
          'callback': `http://iranroboticacademy.com/payment/esp`,
          'reseller': null,
        },
        json: true,
      };
      request(options, function (error, response, body) {
        if (error) console.log(error);
        // console.log(body);
        res.redirect(body.link);
      });  
    }).catch(err => console.log(err));
  }
  else {
    req.flash('error_msg', 'دسترسی مجاز نیست لطفا ابتدا وارد شوید!');
    res.redirect('/users/login');
  }
});
router.post('/esp', function(req,res, next){
  Booklet.findOne({_id: req.body.order_id}, (err, booklet)=>{
    if(booklet){
      var options2 = {
        method: 'POST',
        url: 'https://api.idpay.ir/v1.1/payment/verify',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': 'fe6a4553-cd95-4dff-af2e-80594c1c18c5',
          // 'X-SANDBOX': 1,
        },
        body: {
          'id': req.body.id,
          'order_id': req.body.order_id,
        },
        json: true,
      };
      request(options2, function (error, response, body) {
        if (error) throw new Error(error);
        if(body.status == 100){
          Booklet.updateMany({_id: booklet._id}, { $set: { payed: true } }, function(err){
            if(err) console.log(err);
            res.render('./booklets/esp', {
              user: false,
              booklet
            });
          });
        }
        else{
          res.render('./dashboard/fail-pay', {
            payment: payment
          });
        }
      });
    }
    else res.send('Error!!!!!!!!!!!');
  });
});


router.post('/pay2', function(req, res, next){
  if(req.body.offcode != ''){
    Offcode.findOne({code: req.body.offcode}, (err, offcode) => {
      if(offcode){
        if(Date.now() < offcode.endDate.getTime() && Date.now() > offcode.startDate.getTime()){
          var canUse = true;
          for(var i=0; i<offcode.userList.length; i++){
            if(offcode.userList[i] == req.user.username)
              canUse = false;
          }
          if(canUse){
            console.log('here!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
            Payment.findById(req.body.id, (err, payment) => {
              if(offcode.ispercent) Payment.updateMany({_id: req.body.id}, {$set: {amount: payment.amount - (payment.amount * offcode.percent)}}).then(doc => {
                  var options = {
                    method: 'POST',
                    url: 'https://api.idpay.ir/v1.1/payment',
                    headers: {
                      'Content-Type': 'application/json',
                      'X-API-KEY': 'f965d744-79f0-456f-9b60-c8a4cfeeac59',
                      // 'X-SANDBOX': 1,
                    },
                    body: {
                      'order_id': payment._id,
                      'amount': payment.amount - (payment.amount * offcode.percent),
                      'name': payment.fullname,
                      'username': payment.username,
                      'phone': payment.phone,
                      'desc': payment.description,
                      'callback': 'http://shutterco.ir/payment/pay',
                      'reseller': null,
                    },
                    json: true,
                  };
                  request(options, function (error, response, body) {
                    if (error) console.log(error);
                    res.redirect(body.link);
                  });  
              }).catch(err => {if(err) console.log(err)});
              else                  Payment.updateMany({_id: req.body.id}, {$set: {amount: payment.amount - offcode.price}}).then(doc => {
                  var options = {
                    method: 'POST',
                    url: 'https://api.idpay.ir/v1.1/payment',
                    headers: {
                      'Content-Type': 'application/json',
                      'X-API-KEY': 'f965d744-79f0-456f-9b60-c8a4cfeeac59',
                      // 'X-SANDBOX': 1,
                    },
                    body: {
                      'order_id': payment._id,
                      'amount': payment.amount - offcode.price,
                      'name': payment.fullname,
                      'username': payment.username,
                      'phone': payment.phone,
                      'desc': payment.description,
                      'callback': 'http://shutterco.ir/payment/pay',
                      'reseller': null,
                    },
                    json: true,
                  };
                  request(options, function (error, response, body) {
                    if (error) console.log(error);
                    res.redirect(body.link);
                  });  
              }).catch(err => {if(err) console.log(err)});
            var newList = offcode.userList;
            newList.push(req.user.username);

            Offcode.updateMany({code: req.body.offcode}, {$set: {userList: newList}}).then(doc => {
              console.log('Passed');
            }).catch(err => {if(err) console.log(err)});
            })
          }else {
            res.send('کد تخفیف قابل استفاده نیست.');
          }
        }
      }else{
        res.send('کد تخفیف اشتباه می باشد.');
      }
    });
  }else{
    Payment.findById(req.body.id, (err, payment) => {
      var options = {
        method: 'POST',
        url: 'https://api.idpay.ir/v1.1/payment',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': 'f965d744-79f0-456f-9b60-c8a4cfeeac59',
          // 'X-SANDBOX': 1,
        },
        body: {
          'order_id': payment._id,
          'amount': payment.amount,
          'name': payment.fullname,
          'username': payment.username,
          'phone': payment.phone,
          'desc': payment.description,
          'callback': 'http://shutterco.ir/payment/pay',
          'reseller': null,
        },
        json: true,
      };
      request(options, function (error, response, body) {
        if (error) console.log(error);
        res.redirect(body.link);
      });  
    });
  }
});


module.exports = router;