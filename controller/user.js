var User = require('../models/user');
// var config = require('../config/database');

var postUsers = function(req, res) {
    var user = new User({
        username: req.body.username,
        password: req.body.password
    });

    user.save(function(err) {
        if (err) {
            res.json({ message: 'error', data: err });
            return;
        }
        res.json({ message: 'done', data: user });
    })
};

var getUsers = function(req, res) {
    User.find(function(err, users) {
        if (err) {
            res.json({ message: 'error', data: err });
            return;
        }
        res.json({ message: 'done', data: users });
    })
};

var authenticate = function(req, res) {
    User.findOne({
        username: req.body.username
    }, function(err, user) {
        if (err) {
            throw err
        }
        if (!user) {
            res.status(403).send({ success: false, msg: 'Authentication failed, User not found' });
        } else {
            // 检查用户密码
            user.verifyPassword(req.body.password, function(err, match) {
                if (match && !err) {
                    res.json({ success: true });
                    // config.userid = user._id;
                    return done(null, user)

                } else {
                    return res.status(403).send({ success: false, msg: 'Authenticaton failed, wrong password.' });
                }
            })
        }
    })
}

module.exports = {
    postUsers: postUsers,
    getUsers: getUsers,
    authenticate: authenticate
};