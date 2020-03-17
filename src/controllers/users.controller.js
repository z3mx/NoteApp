const usersController = {};

const passport = require('passport');

const User = require('../models/User');

usersController.renderSignUpForm = (req,res)=>{
    res.render('users/signup');
};

usersController.signUp = async (req,res)=>{
    const errors = [];
    const {name, email, password, confirm_password} = req.body;
    console.log(req.body);
    if(confirm_password != password){
        errors.push({text: 'Password do not match '});
    }
    if(password.length < 8){
        errors.push({text: 'Password it should be at leat 4 characters '});
    }
    if(errors.length > 0 ){
        res.render('users/signup',{
            errors,
            name,
            email,
            password,
            confirm_password
        });
    }else{
       const emailUser = await User.findOne({email: email});
       if(emailUser){
            req.flash('error_msg','The email is already in use');
            res.redirect('/users/signup');
       }else{
           const newUser= new User({name,email,password});
           newUser.password = await newUser.encryptPassword(password);
           await newUser.save();
           req.flash('success_msg','You are registered');
           res.redirect('/users/signin');
       }
    }
        
};

usersController.renderSignInForm = (req,res)=>{
    res.render('users/signin');
};

usersController.signIn = passport.authenticate('local',{
    failureRedirect: '/users/signin',
    successRedirect:'/notes',
    failureFlash: true
});

usersController.logout = (req,res)=>{
    req.logout();
    req.flash('success_msg','You are logged out now');
    res.redirect('/users/signin');
};

module.exports = usersController;