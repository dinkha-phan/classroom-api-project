const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')
const route = express.Router();
const passport = require('../../module/passport/index');
const userModel = require('./user.model');
route.post('/login', passport.authenticate('local',  {session:false}), function(req, res, next){
    res.json({
        user: req.user,
        token: jwt.sign({
            id: req.user.id,
            username: req.user.username,
        }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        })
    })
})
route.post('/signin', async function(req, res, next){
    console.log(req);
    const hash = bcrypt.hashSync(req.body.password, 10);
    var user = {
        Username: req.body.username,
        UserID: req.body.id,
        Password: hash,
        Email: req.body.email,
      };
      await userModel.addUser(user);
})
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
  const GOOGLE_CLIENT_ID = '598338795293-jr8fkbp8mh7cc9s0af161ttqddct9hfp.apps.googleusercontent.com';
  const GOOGLE_CLIENT_SECRET = 'sWXOxXQDk2eRSMI3_z87AApg';
  passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "https://worldvision.lab-io.tech/account/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      userProfile=profile;
      return done(null, userProfile);
  }
));

router.get('/auth/google', 
  passport.authenticate('google', { scope : ['profile', 'email'] }));
 
router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/account/error' }),
  function(req, res) {
    // Successful authentication, redirect success.
    res.redirect('/account/success');
  });

module.exports = route;
