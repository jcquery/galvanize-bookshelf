'use strict';

const knex = require('../knex');
const express = require('express');
const router = express.Router();

router.get('/books', (_req, res, next) => {
  knex('books')
    .orderBy('id')
    .then((books) => {
      res.send(books)
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/books/:id', (req, res, next) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return next();
  }
  knex('books')
    .where('id', id)
    .first()
    .then((book) => {
      res.send(book);
    })
    .catch((err) => {
      next(err);
    });
});

// if (not attribute or attribute.trim === "")
// status: 400, content type: plain text, send: specific error message
// check if the author exists, first check with isnan
// make request to check authors table
// newbook = req.body

router.post('/books', (req, res, next) => {
  const newBook = req.body;
  if (!newBook.title || newBook.title.trim() === "") {
    res.status = 400;
  }
  knex('books')
    .insert(req.body, '*')
    .then((results) => {
      res.send(results[0]);
    })
    .catch((err) => {
      next(err);
    });
});

// req.body = bookChanges
// if (attribute) then change attribute
// vaildate authorid

router.patch('/books/:id', (req, res, next) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return next();
  }
  knex('books')
    .update(req.body, '*')
    .where('id', id)
    .then((results) => {
      res.send(results[0]);
    })
    .catch((err) => {
      next(err);
    });
});

router.delete('/books/:id', (req, res, next) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return next();
  }

  knex('books')
    .where('id', req.params.id)
    .first()
    .then((book) => {
      if (!book) {
        return next();
      }

      return knex('books')
        .del()
        .where('id', req.params.id)
        .then((books) => {
          delete book.id;
          res.send(book);
        });
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
