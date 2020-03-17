const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

const User = require('../models/User');

passport.use(new localStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email,password,done) => {

    //Match email's user
    const user = await User.findOne({email});
    if(!user){
        return done(null,false,{message:"Not User Found"});
    }else{
        //Match password User
        const match  =await user.matchPassword(password);
        if(match){
            return done(null,user);
        }else{
            return done(null,false,{message:"Incorrect Password"});
        }
    }
}));

passport.serializeUser((user,done)=>{
    done(null,user.id);
});

passport.deserializeUser((id,done)=>{
    User.findById(id,(error,user)=>{
        done(error,user);
    })
});