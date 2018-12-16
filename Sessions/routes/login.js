'use strict';

const router = require('express').Router();

module.exports = (sessionStorage, users) => {
  router.get('/login', (req, res)=> {
    res.render('login');
  });

  router.post('/login', (req, res)=> {
    //console.log('req.body.name = ' +req.body.name);
    //console.log(req.body.password);
    if (!req.body.name || !req.body.password) {
      res.render('info',
        errorMessage('You must provide username and password', '/login'));
    }
    else {
      //console.log('päästiin riville 18');
      if (users.checkUser(req.body.name, req.body.password)) {
        if (!sessionStorage.addSession(req.sessionID, req.body.name, req.session)) {
          if (sessionStorage.getUser(req.sessionID) === req.body.name) {
            res.render('info', statusMessage('You are already logged in'));
          }
          else {
            sessionStorage.remove(req.sessionID);
            req.session.destroy();
            res.render('info', errorMessage('Error inn login. Please try again.', '/login'));
          }
        }
        else {
          res.render('info', statusMessage('You are looged in'));
        }
      }
      else {
        res.render('info', errorMessage('You are not allowed to use this site', '/', 'Access denied.'));
      }
    }
  });
  return router;
};

function statusMessage(info='Status', url='/', title='Login', mode='status', delay=3) {
  return {title, info, url, delay, mode};
}
function errorMessage(info='Error', url='/', title='Login', mode='error', delay=3) {
  return {title, info, url, delay, mode};
}
