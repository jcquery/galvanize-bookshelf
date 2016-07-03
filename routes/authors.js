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
  const id = req.params.id;

  if (isNaN(id)) {
    return next();
  }

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
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return next();
  }

  knex('authors')
    .where('id', id)
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
  const newAuthor = req.body;

  if (!newAuthor.first_name || newAuthor.first_name.trim() === "") {
    return res
      .status = 400
      .set('Content-Type', 'text/plain')
      .send('Missing first name');
  }
  if (!newAuthor.last_name || newAuthor.last_name.trim() === "") {
    return res
      .status = 400
      .set('Content-Type', 'text/plain')
      .send('Missing last name');
  }
  if (!newAuthor.biography || newAuthor.biography.trim() === "") {
    return res
      .status = 400
      .set('Content-Type', 'text/plain')
      .send('Missing biography');
  }
  if (!newAuthor.portrait_url || newAuthor.portrait_url.trim() === "") {
    return res
      .status = 400
      .set('Content-Type', 'text/plain')
      .send('Missing portrait_url URL');
  }

  knex('authors')
    .insert(newAuthor, '*')
    .then((results) => {
      res.send(results[0]);
    })
    .catch((err) => {
      next(err);
    });
});

router.patch('/authors/:id', (req, res, next) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return next();
  }

  knex('authors')
    .where('id',id)
    .first()
    .then((author) => {
      if (!author) {
        return next();
      }

      const authorEdit = {
        first_name: req.body.first_name || author.first_name,
        last_name: req.body.last_name || author.last_name,
        biography: req.body.biography || author.biography,
        portrait_url: req.body.portrait_url || author.portrait_url
      }

      return knex('authors')
        .update(authorEdit, '*')
        .where('id', id)
        .then((results) => {
          res.send(results[0]);
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      next(err);
    });
});

router.delete('/authors/:id', (req, res, next) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return next();
  }

  knex('authors')
    .where('id', id)
    .first()
    .then((author) => {
      if (!author) {
        return next();
      }

      return knex('authors')
      .del()
      .where('id', id)
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
