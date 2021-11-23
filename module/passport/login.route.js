const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')
const route = express.Router();
const passport = require('./index');
const userModel = require('../../components/user/user.model');
const { v4: uuidv4 } = require("uuid");
const refreshToken =require('../model/refreshToken.model');
var userProfile;
route.post('/', passport.authenticate('local',  {session:false}), async function(req, res, next){
    console.log(req.user);
    let _rToken = uuidv4();
    let day = new Date();
    day.setTime(day.getTime() + 60480000)
    const token ={
        Email: req.user.email,
        Token: _rToken,
        ExpiredDate: day,
    }
    await refreshToken.addToken(token);
    res.json({
        user: req.user,
        token: jwt.sign({
            email: req.user.email,
            id:req.user.id,
            spec: uuidv4(),
        }, process.env.JWT_SECRET, {
            expiresIn: '5m'
        }),
        refreshToken: _rToken,
    })
})
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
  
  passport.use(new GoogleStrategy({
    clientID: '241758761089-mhhbbvca0eh6nh60sko4td8tp0iqe6r7.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: "https://classrom-api-ntk.herokuapp.com/login/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      userProfile=profile;
      return done(null, userProfile);
  }
));
route.get('/error', function(req, res){
    res.json("error logging in");
  })
route.get('/auth/google',  passport.authenticate('google', { scope : ['profile', 'email'] }));

route.get('/success', async function(req, res){
    const user = await userModel.findByMail(userProfile.emails[0].value);
    if (user === null) {
        const usergg = {
            FullName: userProfile.displayName,
            Email: userProfile.emails[0].value,
        }
        await userModel.addUser(usergg);
        const user_1 = await userModel.findByMail(userProfile.emails[0].value);
        res.json({
            user: user_1,
            token: jwt.sign({
                email: user_1.Email,
                id: user_1.UserID,
            }, process.env.JWT_SECRET, {
                expiresIn: '1h'
            })
        })
        
    }
    else{
        const user_1 = await userModel.findByMail(userProfile.emails[0].value);
        res.json({
            user: user_1,
            token: jwt.sign({
                email: user_1.Email,
                id: user_1.UserID,
            }, process.env.JWT_SECRET, {
                expiresIn: '1h'
            })
        })
    }


})

route.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/account/error' }), function(req, res) {
// Successful authentication, redirect success.
res.redirect('/login/success');
});
module.exports = route;