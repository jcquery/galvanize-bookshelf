'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex');
const bcrypt = require('bcrypt');

router.post('/session', (req, res, next) => {
  const userInfo = req.body;
  if (!userInfo.email || userInfo.email.trim() === "") {
    return res
      .status(400)
      .set('Content-Type', 'text/plain')
      .send('Email must not be blank');
  }
  if (!userInfo.password || userInfo.password.trim() === "") {
    return res
      .status(400)
      .set('Content-Type', 'text/plain')
      .send('Password must not be blank');
  }

  knex('users')
    .where('email', userInfo.email)
    .first()
    .then((user) => {
      if (!user) {
        return res.sendStatus(401);
      }

      const hashed_password = user.hashed_password;

      bcrypt.compare(userInfo.password, hashed_password, (err, isMatch) => {
        if (err) {
          return next(err);
        }
        if (!isMatch) {
          return res.sendStatus(401);
        }
        console.log(user.id);
        req.session.userId = user.id;
        res.cookie('loggedIn', true);
        return res.sendStatus(200);
      })
    })
    .catch((err) => {
      return next(err);
    });
});

router.delete('/session', (req, res, next) => {
  req.session = null;
  res.clearCookie('loggedIn');
  res.sendStatus(200);
});

module.exports = router;
