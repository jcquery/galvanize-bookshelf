'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex');
const bcrypt = require('bcrypt');

router.post('/users', (req, res, next) => {
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
  // 1=1 results in equality check per row rather than returning columns from the table
    .select(knex.raw('1=1'))
    .where('email', userInfo.email)
    .first()
    .then((emailRes) => {
      if (emailRes) {
        return res
          .status(400)
          .set('Content-Type', 'text/plain')
          .send('Email already exists');
      }

      bcrypt.hash(req.body.password, 10, (hashErr, hashed_password) => {
        if (hashErr) {
          next(hashErr);
        }

        knex('users')
        .insert({
          first_name: userInfo.first_name,
          last_name: userInfo.last_name,
          email: userInfo.email,
          hashed_password: hashed_password
        }, '*')
        .then((user) => {
          res.sendStatus(200);
        })
        .catch((err) => {
          next(err);
        });
      });
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
