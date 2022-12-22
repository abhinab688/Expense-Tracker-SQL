const express=require('express');
const path=require('path');
const bodyParser=require('body-parser');
const sequelize=require('./models/database');
const user=require('./models/user');
const expense=require('./models/expense');
const orders=require('./models/orders');
const resetPassword=require('./models/passwordrequests');
const downloadedURLs= require('./models/downloadedURLs');

const app=express();
const dotenv=require('dotenv');
dotenv.config()

var cors=require('cors');
app.use(cors());

// app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

const userRoutes=require('./routes/user');
const expenseRoutes=require('./routes/expense');
const passwordRoutes= require('./routes/password');

app.use(userRoutes);
app.use(expenseRoutes);
app.use(passwordRoutes);

app.use((req,res)=>{
    res.sendFile(path.join(__dirname, `public/${req.url}`))
})

user.hasMany(expense);
expense.belongsTo(user);

user.hasMany(orders);
orders.belongsTo(user);

user.hasMany(resetPassword);
resetPassword.belongsTo(user);

user.hasMany(downloadedURLs);
downloadedURLs.belongsTo(user);


sequelize.sync()
.then(()=>{
    app.listen(3000)
}).catch(err=>{
    console.log(err)
})
