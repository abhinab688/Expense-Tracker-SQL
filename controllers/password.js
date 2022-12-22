const uuid=require('uuid');
const sgMail = require('@sendgrid/mail');
const API_KEY=process.env.SENDGRIP_API_KEY


const User=require('../models/user');
const forgotPassword=require('../models/passwordrequests');

const bcrypt=require('bcrypt');

exports.forgotPassword= async(req,res,next)=>{
    try{
        const {email}= req.body;
        const user= await User.findOne({where:{email}});
        if(user){
            const id=uuid.v4();
            forgotPassword.create({id, Active:true, userId:user.id})
            .catch(err=>{
                throw new Error(err)
            })
        sgMail.setApiKey(API_KEY);
        const msg={
            to: email,
            from: 'abhinab688@gmail.com', 
            subject: 'RESET PASSWORD',
            text: 'Your Password reset link is here:',
            html: `<a href="http://localhost:3000/resetpassword/${id}">Reset password</a>`,
        }
        sgMail.send(msg)
        .then(()=>{
            res.status(201).json({message:'Link has been send to your mail id'})
        })
        .catch(err=>{ throw new Error(err)})
        } else{
            throw new Error('User not exist')
        }      
    }
    catch(err){
        console.log(err)
        return res.status(404).json({success:false, message:'User not exist'})
    }
}

exports.resetPassword=async(req,res,next)=>{
    const id= req.params.uuid;
    forgotPassword.findOne({where:{id}}).then(request=>{
        request.update({Active:false});
        res.status(200).send(
        `<html>
            <script>
            function formsubmitted(e){
                e.preventDefault();
                console.log('called')
            }</script>
            <form action="/updatepassword/${id}" method="get">
                <label for="newpassword">Enter New password</label>
                <input name="newpassword" type="password" required></input>
                <button>Reset Password</button>
            </form>
        </html>`)
        res.end()
    })
}

exports.updatePassword=(req,res,next)=>{
    try{
        const newPassword= req.query.newpassword;
        const id= req.params.uuid;
        console.log(newPassword,'<<<<<<passwewdd')
        forgotPassword.findOne({where:{id:id}}).then((resetrequest)=>{
            User.findOne({where:{id:resetrequest.userId}}).then((user)=>{
                if(user){
                    const saltRounds=10;
                    bcrypt.genSalt(saltRounds, function(err, salt){
                        if(err){
                            console.log(err)
                            throw new Error(err)
                        }
                        bcrypt.hash(newPassword, salt, (err,hash)=>{
                            if(err){
                                throw new Error(err)
                            }
                            user.update({password:hash}).then(()=>{
                                res.status(201).json({message:'Password Succesfully Updated'})
                            }).catch(err=>{
                                throw new Error(err)
                            })
                        })
                    })
                }else{
                    res.status(404).json({message:'User Dont Exist'})
                }

            }).catch(err=>{
                throw new Error(err)
            })
    }).catch(err=>{
        throw new Error(err)
    })
    }catch(err){
        console.log(err)
        return res.status(403).json({success:false, error:err})
    }
    
}