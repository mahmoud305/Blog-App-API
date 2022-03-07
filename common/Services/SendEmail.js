const nodemailer= require("nodemailer");


async function sendEmail(recivers,subject, content) {
    let info;
    
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            service: "gmail",
            // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_SENDER, // generated ethereal user
                pass: process.env.EMAIL_SENDER_PASS, // generated ethereal password
            },
        });
      //  console.log(recivers.join(","));
        // send mail with defined transport object
        try {
             info = await transporter.sendMail({
                from: `"Fred Foo 👻" <{${process.env.EMAIL_SENDER}}>`, // sender address
                to: recivers.join(","), // list of receivers
                subject, // Subject line
                html: content
            });
        } catch (error) {
            console.log("error in sending email ,", error);
            return null;
        }
       
        return info;
    }
    module.exports = sendEmail;