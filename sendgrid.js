const sgmail = require('@sendgrid/mail')
const API = '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'
const uuid = require('uuid')
sgmail.setApiKey(API)
exports.sendmail = async(mailid,code,name) => {
    console.log('in func')
    const msg = {
        to:mailid,
        from:{
            name:'Car Service',
            email:'techsynac@gmail.com'
        },
        subject:'Password Change request for Car Service Account',
        text:'Password Change request',
        html:`Hi ${name},<br><p>We received a request to reset your Car Service Account password.Enter the following password reset code.</p><button class="button button2" style="text-align: center;font-weight: bold;color: black;background-color: white; border: 2px solid blue;padding: 15px 32px;display: inline-block;font-size: 16px;margin: 4px 2px;cursor: pointer;">${code}</button><br><hr><br><p style="font-size:10px">This message was sent to techsynac@gmail.com at your request.</p>`
    }
    sgmail.send(msg)
    .then((response)=>{
        console.log(response)
        return response
    })
    .catch((err)=>{
        // console.log(err.message)
        return err
    })

}


