var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'shutterproje@gmail.com',
    pass: 'lhdukddklniquocd'
  }
});

module.exports = (to, subject, html) => {
    var mailOptions = {
        from: 'shutterproje@gmail.com',
        to: to,
        subject: subject,
        text: html
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}