'use strict';

const knex = require('../knex');
const express = require('express');
const router = express.Router();

router.get('/authors', (_req, res, next) => {
  knex('authors')
    .orderBy('id')
    .then((authors) => {
      res.send(authors);
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/authors/:id/books', (req, res, next) => {
  knex('books')
    .where('author_id', req.params.id)
    .orderBy('id')
    .then((books) => {
      res.send(books);
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/authors/:id', (req, res, next) => {
  knex('authors')
    .where('id', req.params.id)
    .first()
    .then((artist) => {
      if (!artist) {
        return next();
      }
      res.send(artist);
    })
    .catch((err) => {
      next(err);
    });
});

router.post('/authors', (req, res, next) => {
  knex('authors')
    .insert(req.body, '*')
    .then((results) => {
      res.send(results[0]);
    })
    .catch((err) => {
      next(err);
    });
});

router.patch('/authors/:id', (req, res, next) => {
  knex('authors')
    .update(req.body, '*')
    .where('id', req.params.id)
    .then((results) => {
      if (results.length === 0) {
        return next();
      }

      res.send(results[0]);
    })
    .catch((err) => {
      next(err);
    });
});

router.delete('/authors/:id', (req, res, next) => {
  knex('authors')
    .where('id', req.params.id)
    .first()
    .then((author) => {
      if (!author) {
        return next();
      }

      return knex('authors')
      .del()
      .where('id', req.params.id)
      .then((authors) => {
        delete author.id;
        res.send(author);
      })
    })
    .catch((err) => {
      next(err);
    })
});

module.exports = router;
