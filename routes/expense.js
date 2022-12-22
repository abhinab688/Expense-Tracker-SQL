const express=require('express');

const paymentController= require('../controllers/payment');
const userAuthenticate= require('../middleware/auth');

const router=express.Router();

router.get('/premiummembership',userAuthenticate.authenticate,paymentController.purchasePremium);

router.post('/updatetransactionstatus', userAuthenticate.authenticate, paymentController.updateTransactionStatus);

router.get('/premiumusers',userAuthenticate.authenticate, paymentController.getPremiumUser);

router.get('/getdetails/:userId', paymentController.getUserDetails);

module.exports=router;

