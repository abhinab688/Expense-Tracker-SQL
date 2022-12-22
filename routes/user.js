const express=require('express');

const userController=require('../controllers/user');
const userAuthenticate= require('../middleware/auth');

const router=express.Router();

router.post('/signup',userController.signup);

router.post('/login' , userController.login);

router.post('/addExpense',userAuthenticate.authenticate,userController.addExpense);

router.get('/getExpense', userAuthenticate.authenticate ,userController.getExpense);

router.get('/getallexpenses', userAuthenticate.authenticate, userController.getAllExpense);

router.delete('/deleteExpense/:expenseId',userAuthenticate.authenticate ,userController.deleteExpense);

router.get('/getusers',userController.getUser);

router.get('/download', userAuthenticate.authenticate, userController.downloadExpense);

router.get('/downloadhistory', userAuthenticate.authenticate, userController.getDownloadHistory);

module.exports= router;