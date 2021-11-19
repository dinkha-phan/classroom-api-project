const passport = require("passport"),
    LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy,
 ExtractJWT = require("passport-jwt").ExtractJwt;
 const bcrypt = require('bcryptjs');
const UserModel = require("../../components/user/user.model") 
 passport.use(new LocalStrategy({session:false},
    async function(username, password, done){
        console.log(password);
        const user = await UserModel.findUserByUsername(username);
        console.log(user);
        if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
        }
        const ret = bcrypt.compareSync(password, user[0].Password);
        if (ret === false) {
            return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, {id: user[0].UserID, username: user[0].Username})

    }    
    
));
const opts ={}
opts.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
opts.secretOrKey =process.env.JWT_SECRET;
passport.use(new JwtStrategy(opts, function(jwt_payload, done){
    return done(null, {id: jwt_payload.id, username: jwt_payload.username})
}))
module.exports  =passport;