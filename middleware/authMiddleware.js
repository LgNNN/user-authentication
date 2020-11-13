const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv/config');
const SECRET_KEY = process.env.TOKEN_SECRET_KEY || 'random secret code!';

//redirect to secret page from login and signup if the user is authenticated.
const redirectAuthed = (req,res,next)=>{
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token, SECRET_KEY, (err,tokenPayload)=>{
            if(err){
                next();
            }else{
                res.redirect('/secret');
            }
        });
    }else{
        next();  
    }
};

//routes with this middleware require user to be authenticated
const authRequired = (req,res,next)=>{
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token, SECRET_KEY, (err,tokenPayload)=>{

            if(err){
                res.redirect('/login');
            }else{
                next();
            }
        });
        
    }else{
        res.redirect('/login');  
    }
};

//valid body fields from incoming requests 
const valid_fields = (allowedFields) => { return (req, res, next) => {
    const fields = Object.keys(req.body);
    const allFieldsValid = fields.every(field => allowedFields.includes(field));
    if (!allFieldsValid)
        return res.status(400).json({error: 'Invalid Fields'});
    next();
}};

//extract information from the token 
const userCheck = (req,res,next)=>{
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token,SECRET_KEY, async (err,tokenPayload)=>{
            if(err){
                res.locals.emal = null;
                next();
            }else{
                const user = await User.findById(tokenPayload.id);
                res.locals.email = user.email
                next();
            }
        });  
    }else{
        res.locals.email = null;
        next();  
    }
};


module.exports = {
    redirectAuthed,
    userCheck,
    authRequired,
    valid_fields
}