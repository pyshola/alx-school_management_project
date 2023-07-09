var passport = require('passport')
var LocalStrategy    = require('passport-local').Strategy;
var jwt = require('jsonwebtoken');
var Sequelize = require("sequelize");
var model = require("../models/schooldb");
var sequelize = new Sequelize("postgres://virilesoftware:shollybay123@A@127.0.0.1:5432/virilesoftware_alxproject",{logging: false});

var bcrypt = require('bcryptjs');
var User = model.User_table(sequelize);

module.exports = function(passport) {
//module.exports = function(passport) {
passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, email, password, done) {

        // asynchronous
        process.nextTick(function() {
            User.findOne({where: {email: {$iLike:  email}}}).then(function (user) {
				console.log(user)
				if(!user)
				{
					return done(null, false, { message: 'Email address do not exit'} );
				}
				
                // if there are any errors, return the error
                var hash = user.token;
				
				if (bcrypt.compareSync(password, hash)) {
					//if(user.verify == 0)
					//{
						//return done(null, false, { message:'Account not verify!.'});
					//}
					//else
					//{
						return done(null, user);
					//}
					
				}
				else
				{
					return done(null, false, { message:'Invalid email adddress or Wrong password!.'});
				}
                    
            }).catch(function(error){
				return done(null, false, { message: 'Server error'} );
			});;
        });

    }));
	


}