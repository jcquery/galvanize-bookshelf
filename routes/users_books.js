'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex');

const checkAuth = function(req, res, next) {
  if (!req.session.userId) {
    return res.sendStatus(401);
  }

  next();
};

router.get('/users/books', checkAuth, (req, res, next) => {
  knex('users_books')
    .innerJoin('books', 'books.id', 'users_books.book_id')
    .where('users_books.user_id', req.session.userId)
    .then((books) => {
      res.send(books);
    })
    .catch((err) => {
      return next(err);
    });
});

router.get('/users/books/:id', checkAuth, (req, res, next) => {
  const bookId = parseInt(req.params.id);
  const userId = req.session.userId;
  knex('users_books')
    .innerJoin('books', 'books.id', 'users_books.book_id')
    .where({
      'users_books.user_id': userId,
      'users_books.book_id': bookId
    })
    .first()
    .then((book) => {
      if (!book) {
        return res
          .status(404)
          .set('Content-Type', 'text/plain')
          .send("You haven't saved that book.");
      }
      res.send(book);
    })
    .catch((err) => {
      return next(err);
    });
});

router.post('/users/books/:id', checkAuth, (req, res, next) => {
  const bookId = parseInt(req.params.id);
  const userId = req.session.userId;

  knex('books')
    .where('id', bookId)
    .first()
    .then((book) => {
      if (!book) {
        return res
          .status(400)
          .set('Content-Type', 'text/plain')
          .send('Invalid book ID');
      }
      return knex('users_books')
        .insert({
          user_id: userId,
          book_id: bookId
        }, '*')
        .then((results) => {
          res.send(results[0]);
        })
        .catch((err) => {
          return next(err);
        });
    })
    .catch((err) => {
      return next(err);
    });
});

router.delete('/users/books/:id', checkAuth, (req, res, next) => {
  const bookId = parseInt(req.params.id);
  const userId = req.session.userId;

  if (isNaN(bookId)) {
    return next();
  }

  knex('users_books')
    .where({
      'user_id': userId,
      'book_id': bookId
    })
    .first()
    .then((book) => {
      if (!book) {
        return res
        .status(404)
        .set('Content-Type', 'text/plain')
        .send("You haven't saved that book.");
      }

      return knex('users_books')
        .where({
          'users_books.user_id': userId,
          'users_books.book_id': bookId
        })
        .del()
        .then((books) => {
          delete book.id;
          return res.send(book);
        })
    })
    .catch((err) => {
      return next(err);
    });
});

module.exports = router;
