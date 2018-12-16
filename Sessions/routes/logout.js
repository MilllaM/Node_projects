'use strict';

const router = require('express').Router();

module.exports = (sessionStorage) => router.get('/logout', (req, res) => {
  let id = req.sessionID;
  if (sessionStorage.hasSession(id)) {
    let user = sessionStorage.getUser(id);
    sessionStorage.remove(id);
    res.render('info', {
      title: 'Logout',
      info: `You are logged out. Have a nice day ${user}!`,
      url:'/',
      delay: 2,
      mode: 'status'
    });
    req.session.destroy();
  }
  else {
    res.render('info', {
      title: 'Logout',
      info: 'You are not logged in.',
      url: '/',
      delay: 1,
      mode: 'error'
    });
  }
});
