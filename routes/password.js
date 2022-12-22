const express=require('express');

const passwordController= require('../controllers/password');
const userAuthenticate= require('../middleware/auth');

const router=express.Router();

router.post('/forgotpassword', passwordController.forgotPassword);

router.get('/resetpassword/:uuid', passwordController.resetPassword);

router.get('/updatepassword/:uuid', passwordController.updatePassword);

module.exports=router;