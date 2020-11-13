const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv/config');
const SECRET_KEY = process.env.TOKEN_SECRET_KEY || 'random secret code!';

//handles the errors and bundles them to an object rdy to send to the client
const errorHandling = (error) =>{
    const err = {};
    const {code,message,errors} = error;

    if(message === 'Invalid email'){
        err.email = 'Enter a valid email.';
    }
    if(message === 'Incorrect email'){
        err.email = 'The email is incorrect.';
    }
    if(message === 'Incorrect password'){ 
        err.password = 'The password is incorrect.';
    }

    if(code){
        err.email = 'Email is already registered.';
    }

    if(message.includes('validation failed')){
        for(const property in errors){
           err[errors[property].properties.path] = errors[property].properties.message; 
        }
    }
    return err;
};

 //create a new token
const maxAge = 60*60*24*30; // token will be valid for 30 days
const createToken = (id,expireAge) =>{  //time in seconds
    if(expireAge){
        return jwt.sign({id},SECRET_KEY, {expiresIn:expireAge});
    }
    return jwt.sign({id},SECRET_KEY);
}



const user_signup = async (req, res) => {
    try {
        const user = await User.create(req.body);
        const token = createToken(user._id,'1d');
        res.cookie('jwt',token, {httpOnly: true });
        res.status(201).json(user);
    } catch (error) {
        const errors = errorHandling(error);
        res.status(400).json({errors});
    }
};

const user_login = async (req,res)=>{
    const {email,password,remember} = req.body;
    try {
        const user = await User.login(email,password); //this functions will throw an error if not matched
        let token;
        if(remember){ //if remember me is checked 
            token = createToken(user._id,maxAge); // token valid for 30 days
            res.cookie('jwt',token, { maxAge: maxAge*1000, httpOnly: true }); //cookie expires in 30 days
        }else{
            token = createToken(user._id,'1h'); // token valid for 1 hour
            res.cookie('jwt',token, { httpOnly: true }); //cookie valid for session
        }
        res.json(user);
    } catch (error) {
        const errors = errorHandling(error);
        res.status(400).json({errors})
    }
}

const user_logout = (req,res)=>{
    res.cookie('jwt','',{maxAge:1}); //cookie set to 1ms will instantly expire when logged out
    res.redirect('/');
}


const render_login = (req,res)=> res.render('login');
const render_signup = (req,res)=> res.render('signup');



module.exports = {
    user_logout,
    user_login,
    user_signup,
    render_login,
    render_signup
};