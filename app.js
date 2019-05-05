var express = require('express');
var path = require('path');
var router = express.Router();
var session = require('express-session');
var cookie = require('cookie-parser');
var User = require('./schemas/user');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);
var app = express();

app.use('/', express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('trust proxy', 1);
// app.use(cookie('express_cookie'));
//cookie
// app.post('/login', function (req, res) {
//     User.findOne({
//         username: req.body.username
//     }).then(function (userInfo) {
//         if (!userInfo) {
//             console.log('user is not exist.');
//             return;
//         }
//         var data = {};
//         data['username'] = userInfo.username;
//         data['password'] = userInfo.password;
//         res.cookie('username', JSON.stringify(data), { maxAge: 900000, httpOnly: true });
//         res.status(200).json(data);
//     })
//         .catch(function (e) {
//             console.log(e);
//         })
// })

// session 
// app.use(cookie('express_cookie'));
// app.use(session({
//     secret: 'express_cookie',
//     resave: false,
//     saveUninitialized: true,
//     cookie: { maxAge: 60 * 1000 * 30 },
//     rolling: true,
// }));

// app.post('/login', function (req, res) {
//     User.findOne({
//         username: req.body.username
//     }).then(function (userInfo) {
//         if (!userInfo) {
//             console.log('user is not exist.');
//             return;
//         }
//         var data = {};
//         data['username'] = userInfo.username;
//         data['password'] = userInfo.password;
//         req.session.userInfo = data;
//         res.status(200).json(data);
//     })
//         .catch(function (e) {
//             console.log(e);
//         })
// })

//session in mongodb
// app.use(cookie('express_cookie'));
// app.use(session({
//     secret: 'express_cookie',
//     resave: false,
//     saveUninitialized: true,
//     cookie: { maxAge: 60 * 1000 * 30 },
//     rolling: true,
//     store: new MongoStore({
//         url: 'mongodb://127.0.0.1:27017/demo',
//         collection: 'sessions'
//     })
// }));
// app.post('/login', function (req, res) {
//     User.findOne({
//         username: req.body.username
//     }).then(function (userInfo) {
//         if (!userInfo) {
//             console.log('user is not exist.');
//             return;
//         }
//         var data = {};
//         data['username'] = userInfo.username;
//         data['password'] = userInfo.password;
//         req.session.userInfo = data;
//         res.status(200).json(data);
//     })
//         .catch(function (e) {
//             console.log(e);
//         })
// })

//session in redis
// var RedisStrore = require('connect-redis')(session);
// app.use(session({
//     secret: 'express_cookie',
//     resave: false,
//     saveUninitialized: true,
//     cookie: { maxAge: 60 * 1000 * 30 },
//     rolling: true,
//     store: new RedisStrore({})
// }));

var jwt = require('jsonwebtoken');
//token
app.post('/login', function (req, res) {
    User.findOne({
        username: req.body.username
    }).then(function (userInfo) {
        if (!userInfo) {
            console.log('user is not exist.');
            return;
        }
        var data = {};
        data['username'] = userInfo.username;
        data['password'] = userInfo.password;
        var token = jwt.sign(data, 'tokensecert', {
            expiresIn: 60*60*1
        });
        res.status(200).json({
            message: 'success',
            token: token
        });
    })
        .catch(function (e) {
            console.log(e);
        })
})

app.get('/userInfo', checkToken, function (req, res) {
    var a = req;
    res.status(200).json({
        message: 'get token'
    })
    //cookie
    // if (req.cookies.userInfo) {
    //     console.log('login successfully')
    // }
    // else {
    //     console.log('session timeout.');
    // }
    // res.status(200).json(req.cookies.userInfo);
    // session
    // if (req.session.userInfo) console.log('login successfully');
    // else console.log('session timeout.');

})

function checkToken(req, res, next) {
    var token = req.body.token || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, 'tokensecert', function () {
            if (e) res.json({
                message: 'error'
            })
            else {
                req.api_user = decoded;
                next();
            }
        })
    } else {
        res.send({
            message: 'no  token.'
        })
    }
}

app.post('/register', function (req, res) {
    User.findOne({
        username: req.body.username
    })
        .then(function (res) {
            if (res)
                console.log('user exist.');
            let user = new User({
                username: req.body.username,
                password: req.body.password
            })
            user.save()
                .then(function (res) {
                    User.findOne({
                        username: req.body.usename
                    })
                        .then(function (res) {
                            if (res)
                                console('register user successfully.')
                        })
                        .catch(function (e) {
                            console.log(e);
                        })
                })
                .catch(function (e) {
                    console.log(e);
                })
        })
        .catch(function (e) {
            console.log(e);
        })
})

mongoose.connect('mongodb://127.0.0.1:27017/demo', function (err) {
    if (err) {
        console.log(err, 'error');
        return;
    }
    app.listen(8888, () => console.log('listening on port 8888.'))
})


module.exports = app;