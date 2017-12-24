var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var BearerStrategy = require('passport-http-bearer').Strategy;

var User = require('../models/user');
var Client = require('../models/client');
var Token = require('../models/token');

passport.use("basic", new BasicStrategy(
    function(username, password, done) {
        console.log('basic authentication');
        User.findOne({ username: username }, function(err, user) {
            if (err) {
                return done(err)
            }
            // 用户不存在
            if (!user) {
                return done(null, false, { message: "Invalid user" })
            }
            // 检查用户密码
            user.verifyPassword(password, function(err, match) {
                // 密码不匹配
                if (!match) {
                    return done(null, false)
                }
                console.log(match)
                    // 成功
                return done(null, user)
            })

        })
    }
));

passport.use('client-basic', new BasicStrategy(
    function(username, password, done) {
        console.log('client-basic authentication');
        console.log(username);
        Client.findOne({ id: username }, function(err, client) {
            if (err) {
                return done(err)
            }
            // client不存在或client.secret和password不相等
            if (!client || client.secret !== password) {
                return done(null, false)
            }

            console.log(client);
            return done(null, client);
        })
    }
))

passport.use(new BearerStrategy(
    function(accessToken, done) {
        console.log('Bearer authentication');
        console.log(accessToken);

        Token.findOne({ value: accessToken }, function(err, token) {
            console.log(token);
            if (err) {
                return done(err)
            }
            if (!token) {
                return done(null, false)
            }
            User.findOne({ _id: token.userId }, function(err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false);
                }
                done(null, user, { scope: '*' });
            })
        })
    }
));
// passport使用BasicStrategy认证用户，session为false,passport不存储用户的session,每次请求都需要用户名密码
module.exports = {
    isAuthenticated: passport.authenticate(['basic'], { session: false }),
    isClientAuthenticated: passport.authenticate('client-basic', { session: false }),
    isBeareAuthenticated: passport.authenticate('bearer', { session: false })
};