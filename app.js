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
app.use(cookie('express_cookie'));
app.use(session({
    secret: 'express_cookie',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 1000 * 30 },
    rolling: true,
    store: new MongoStore({
        url: 'mongodb://localhost:27107/test',
        collection: 'sessions'
    })
}));

app.post('/login', function (req, res) {
    User.findOne({
        username: req.body.username
    }).then(function (res) {
        if (!res) {
            console.log('user is not exist.');
            return;
        }
        var data = {};
        data['username'] = res.username;
        data['userId'] = res._id;
        req.session.userInfo = data;
    })
        .catch(function (e) {
            console.log(e);
        })
})

app.get('/userInfo', function (req, res) {
    if (req.session.userInfo) console.log('login successfully');
    else console.log('session timeout.');
})

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

mongoose.connect('mongodb://127.0.0.1:27017/test', function (err) {
    if (err) {
        console.log(err, 'error');
        return;
    }
    app.listen(8888, () => console.log('listening on port 8888.'))
})


module.exports = app;