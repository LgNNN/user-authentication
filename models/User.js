const mongoose = require('mongoose');
const {isEmail} = require('validator');
const passwordValidator = require('password-validator');
const bcrypt = require('bcrypt');

const passSchema = new passwordValidator();
passSchema                                  
.is().max(65)                                  // Maximum length 65 (pre('save) validates unmodified data hashed password is 60)
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits()                                // Must have digits
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true,'You must provide an email.'],
        trim: true,
        unique: true,
        lowercase: true,
        validate: [isEmail,'Enter a valid email.']     
    },

    password: {
        type: String,
        minlength: [8,'Password must contain at least 8 characters.'],
        required: [true,'You must provide a password.'],
        trim: true,
        validate(value){
            if(!passSchema.validate(value)){
                throw new Error('Password must contain at least one upper/lowercase letter, number and special character.');
            }     
        }
    },

    signUpDate: {
        type: Date,
        default: Date.now
    }

});


userSchema.statics.login = async function(email, password){
    //this refers to the model,the User model in this case.
    if(!isEmail(email)){
        throw new Error('Invalid email');
    }

    const user = await this.findOne({email});

    if (!user) {
        throw new Error('Incorrect email');
    }
    
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error('Incorrect password');
    }

    return user;
};


userSchema.pre('save', async function (next) {
    //this refers to the document being saved
    if (this.isModified('password')){
        const salt = await bcrypt.genSalt();
        this.password = await bcrypt.hash(this.password,salt)
    }
    next();
});


module.exports = mongoose.model('User', userSchema);