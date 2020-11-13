const express = require('express');
const path = require('path');
const authRoutes = require('../routes/authRoutes');
const {authRequired,userCheck} = require('../middleware/authMiddleware');
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 3000;
const app = express();
require('./db'); 

//set view engine
app.set('view engine','ejs'); 
app.set('views', path.join(__dirname,'../views'));

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));


//routing
app.get('*',userCheck);
app.use(authRoutes);
app.get('/', (req,res)=>res.render('home'));
app.get('/secret', authRequired , (req,res)=>res.render('secret'));
app.get('*',(req,res)=>res.render('404'));

app.listen(PORT,()=>console.log('Server listening on port : '+PORT));






