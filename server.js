var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');


var petController = require('./controller/pet');
var userController = require('./controller/user');
var authController = require('./controller/auth');

var clientController = require('./controller/client');
var oauth2Controller = require('./controller/oauth2');

mongoose.connect('mongodb://127.0.0.1:27017/petshot', { useMongoClient: true });
mongoose.Promise = global.Promise;

var app = express();


var port = process.env.PORT || '3090';
var router = express.Router();

// 配置模板引擎
app.set('view engine', 'ejs');

// 注：中间件位置很重要
// app.use(bodyParser.raw);
// app.use(bodyParser.json);
// 解析 application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: true
}));

// 配置session
app.use(session({
    secret: 'a4f8071f-4447-c873-8aa2', //String类型的字符串，作为服务器端生成session的签名
    saveUninitialized: true, //初始化session时是否保存到存储
    resave: true //(是否允许)当客户端并行发送多个请求时，其中一个请求在另一个请求结束时对session进行修改覆盖并保存
}));

// 初始化passport,session存储验证状态
app.use(passport.initialize());
app.use(passport.session());
var Pet = require('./models/pet');

router.get('/', function(req, res) {
    res.json({ "message": "欢迎访问" })
})

// router.get('/callback',function(req,res){
//     var code = req.query.code;
//     var session = req.session;

//     res.render('dialog', {
//         transactionID: req.oauth2.transactionID,
//         user: config.userid,
//         client: req.oauth2.client
//     });
// })
// 给路由设定根路径为/api
app.use('/api', router);

router.route('/authenticate')
    .post(userController.authenticate);

// 使用BasicStrategy 

router.route('/pets')
    .post(authController.isAuthenticated, petController.postPets)
    .get(authController.isAuthenticated, petController.getPets);

router.route('/pets/:pet_id')
    .get(authController.isAuthenticated, petController.getPet)
    .put(authController.isAuthenticated, petController.updatePet)
    .delete(authController.isAuthenticated, petController.deletePet);

// router.route('/pets')
//     .post(authController.isBeareAuthenticated, petController.postPets)
//     .get(authController.isBeareAuthenticated, petController.getPets);

// router.route('/pets/:pet_id')
//     .get(authController.isBeareAuthenticated, petController.getPet)
//     .put(petController.updatePet)
//     .delete(authController.isBeareAuthenticated, petController.deletePet);

router.route('/users')
    .post(userController.postUsers)
    .get(authController.isAuthenticated, userController.getUsers); // 使用BasicStrategy 

router.route('/clients')
    .post(authController.isAuthenticated, clientController.postClients)
    .get(authController.isAuthenticated, clientController.getClients);

router.route('/oauth2/authorize')
    .get(authController.isAuthenticated, oauth2Controller.authorization) // 启动授权过程
    .post(authController.isAuthenticated, oauth2Controller.decision); // 用户决定后的调用

router.route('/oauth2/token')
    .post(authController.isClientAuthenticated, oauth2Controller.token); // 得到code后的调用

app.listen(port, function() {
    console.log('server is running at http://localhost:3090');
});