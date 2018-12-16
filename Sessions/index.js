'use strict';
//npm modules
const http = require('http');
const path = require('path');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');

const durationsS = s => 1000 * s;
const minute = durationsS(60);

const port = process.env.PORT || 3000;
const host = process.env.HOST || '127.0.0.1';

const UserStorage = require('./storage/users');
const SessionStorage = require('./storage/sessionstorage');
const users = new UserStorage();
const sessionStorage = new SessionStorage(minute, minute);

//create the server
const app = express();
const server = http.createServer(app);

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use('/styles', express.static(path.join(__dirname,'styles')));
// tell express that we'll use ejs as our view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'pageviews'));

const getterRouter = require(path.join(__dirname, 'routes', 'getters.js'));
const loginRouter = require(path.join(__dirname, 'routes', 'login.js'));
const logoutRouter = require(path.join(__dirname, 'routes','logout.js'));

let password = new Date().toString();
var hash = bcrypt.hashSync(password, 10);

app.use(session({
  secret: process.env.SECRET || hash,
  resave: false,
  saveUninitialized: true
  //cookie: {
  //maxAge: minuutti,
  //httpOnly: false
  //}
}));

//routes
//default mount path is "/"
//app.use('/', getterRouter(admin, user, login, publicResource));
app.use(getterRouter(sessionStorage, users));
app.use(loginRouter(sessionStorage, users));
app.use(logoutRouter(sessionStorage));

// tell the server what port to listen on
server.listen(port, host, () =>
/*eslint-disable no-console*/
  console.log(`server ${host} is listening at port ${port}`)
);
