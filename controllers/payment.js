const Razorpay=require('razorpay');
const Expense = require('../models/expense');
const Orders=require('../models/orders');
const Users=('../models/user.js');

exports.purchasePremium= async(req,res,next)=>{
    try{
        var rzp= new Razorpay({
            key_id:process.env.RAZORPAY_KEY_ID,
            key_secret:process.env.RAZORPAY_KEY_SECRET
        })
        const amount=2500;

        rzp.orders.create({amount, currency:'INR'}, (err,order) =>{
            if(err){
                throw new Error(err)
            }
            req.user.createOrder({orderid: order.id, status:'PENDING'})
            .then(()=>{
                res.status(201).json({order, key_id: rzp.key_id})
            }).catch(err=>{
                throw new Error(err)
            })
        })
    }
    catch(err){
        console.log(err)
        res.status(403).json({message: 'went wrong'})
    }
}

exports.updateTransactionStatus = (req,res,next)=>{
    try{
        const {order_id, payment_id}=req.body;
        Orders.findOne({where:{orderid:order_id}}).then(order=>{
            console.log(order,'<<<<<<<<order')
            order.update({paymentid:payment_id, status:'SUCCESSFUL'}).then(()=>{
                req.user.update({ispremiumuser:true})
                return res.status(201).json({success:true, message:"Transaction Successful"})
            }).catch((err)=>{
                throw new Error(err)
            })
        }).catch(err =>{
            throw new Error(err)
        })
    }
    catch(err){
        console.log(err)
        res.status(403).json({error:err, message:'Something Went Wrong'})
    }
}


//to check wether a user has premium or not
exports.getPremiumUser = (req,res,next)=>{
    req.user.getOrders({where:{status:'SUCCESSFUL'}})
    .then(data=>{
        if(data.length>0){
            res.json({ispremiumuser:true, message:'Premium User'})
        }else{
            res.json({ispremiumuser:false, message:'Not Premium User'})
        }   
    })
    .catch(err=>{
        console.log(err)
    })
}


//to get user expenses (premium feature)
exports.getUserDetails=async(req,res,next)=>{
    const userId= req.params.userId;
    // console.log(userId)
    Expense.findAll({where:{userId:userId}})
    .then((data)=>{
        res.json({data:data})
    }).catch(err => console.log(err))
}