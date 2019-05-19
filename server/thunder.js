"use strict";

var api_key = process.env.MAILGUN_KEY;
var domain = process.env.MAILGUN_DOMAIN;
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
const nodemailer = require("nodemailer");



exports.thunder = (tweet) => {
  
  var data = {
    from: process.env.MAIL_FROM,
    to: process.env.MAIL_TO,
    subject: '#sendthunder',
    'h:Reply-To': process.env.MAIL_FROM,
    'h:Return-Path': process.env.MAIL_FROM,
    text: tweet
  };
   
  mailgun.messages().send(data, function (error, body) {
    console.log(body);
  });

}

exports.thunder2 = async (tweet) => {
  
  
  // async..await is not allowed in global scope, must use a wrapper
  // async function main(){
  
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    // let testAccount = await nodemailer.createTestAccount();
  
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: process.env.MAILGUN_HOST,
      port: process.env.MAILGUN_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.MAILGUN_USERNAME,
        pass: process.env.MAILGUN_PASSWORD
      }
    });
    console.log('ok')
  
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Coolstanlee" <'+process.env.MAIL_FROM+'>', // sender address
      to: process.env.MAIL_TO, // list of receivers
      subject: "#sendthunder", // Subject line
      text: tweet, // plain text body
      html: tweet // html body
    });
  
    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  
    // Preview only available when sending through an Ethereal account
    // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  // }

}

// module.exports = thunder2;