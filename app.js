var express = require('express');
var path = require('path');
var router = express.Router();
var session = require('express-session');
var cookie = require('cookie-parser');
var User = require('./schemas/user');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();

app.use('/', express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('trust proxy', 1);
app.use(cookie('test'));
app.use(session({
    secret: 'test',
    resave: true,
    saveUninitialized: false,
    cookie: { maxAge: 60000 }
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
    req.session;
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

  app.listen(8888, () => console.log('listening on port 8888.'))


module.exports = app;