var oauth2orize = require('oauth2orize');

var User = require('../models/user');
var Client = require('../models/client');
var Token = require('../models/token');
var Code = require('../models/code');

var config = require('../config/database');


// 创建一个OAuth2.0 server
var server = oauth2orize.createServer();

// 注册 序列化 serializeClient 方法
// 当client重定向用户到用户授权接口，授权交易被启动，为完成这个交易，用户必做批准授权请求
// 因为这可能涉及多个HTTP请求/响应交换，交易需要存储的会话中
server.serializeClient(function(client, callback) {
    return callback(null, client._id);
});
// 注册 反序列化 deserializeClient 方法
server.deserializeClient(function(id, callback) {
    Client.findOne({ _id: id }, function(err, client) {
        if (err) {
            return callback(err);
        }
        return callback(null, client);
    })
});

// 注册 授予授权码模式
server.grant(oauth2orize.grant.code(function(client, redirectUri, user, ares, callback) {
    console.log("code oauth2orize");
    console.log(client);
    var code = new Code({
        value: uid(16),
        redirectUri: redirectUri,
        userId: client.userId,
        clientId: client._id
    });
    code.save(function(err) {
        if (err) {
            return callback(err);
        }
        console.log(code);
        return callback(null, code.value);
    });
}));

// 使用code交换token
server.exchange(oauth2orize.exchange.code(function(client, code, redirectUri, callback) {
    console.log("exchange oauth2orize");
    console.log(client);
    console.log(code);
    Code.findOne({ value: code }, function(err, authCode) {
        if (err) {
            return callback(err);
        }
        if (authCode === null) {
            return callback(null, false);
        }
        if (client._id.toString() !== authCode.clientId) {
            return callback(null, false);
        }
        if (redirectUri !== authCode.redirectUri) {
            return callback(null, false);
        }

        // code被使用后删除
        authCode.remove(function(err) {
            if (err) {
                return callback(err);
            }
            // 创建新的access token
            var token = new Token({
                value: uid(256),
                clientId: authCode.clientId,
                userId: authCode.userId
            });

            console.log(token);
            token.save(function(err) {
                if (err) {
                    return callback(err);
                }
                return callback(null, token);
            })
        })
    })
}))


// 初始化一个新的授权交易，找到要访问用户账号的客户端后渲染授权页面
exports.authorization = [
    server.authorization(function(clientId, redirectUri, callback) {
        console.log(clientId);
        Client.findOne({ id: clientId }, function(err, client) {
            if (err) {
                return callback(err);
            }
            console.log(client);
            return callback(null, client, redirectUri);
        });
    }),
    function(req, res) {
        console.log(req.oauth2);
        res.render('dialog', {
            transactionID: req.oauth2.transactionID,
            user: req.user,
            client: req.oauth2.client
        });
    }
]

// 用户批准或拒绝后的处理，调用server.grant处理提交的数据
exports.decision = [
    server.decision()
]

// 通过用户授权后得到code
exports.token = [
    server.token(), // 调用 server.exchange
    server.errorHandler()
]

function uid(len) {
    var buf = [];
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charlen = chars.length;

    for (var i = 0; i < len; i++) {
        buf.push(chars[getRandomInt(0, charlen - 1)]);
    }
    return buf.join('');
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
// module.exports = {
//     authorization: [
//         server.authorization(function(clientId, redirectUri, callback) {
//             Client.findOne({ id: clientId }, function(err, client) {
//                 if (err) {
//                     return callback(err);
//                 }
//                 callback(null, client, redirectUri);
//             });
//         }),
//         function(req, res) {
//             res.render('dialog', {
//                 transactionID: req.oauth2.transactionID,
//                 user: req.user,
//                 client: req.oauth2.client
//             });
//         }
//     ],
//     decision: [server.decision()],
//     token: [
//         server.token(),
//         server.errorHandler()
//     ]
// }