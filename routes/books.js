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
    return res
      .status = 400
      .set('Content-Type', 'text/plain')
      .send('Missing book title');
  }
  if (!newBook.genre || newBook.genre.trim() === "") {
    return res
      .status = 400
      .set('Content-Type', 'text/plain')
      .send('Missing book genre');
  }
  if (!newBook.description || newBook.description.trim() === "") {
    return res
      .status = 400
      .set('Content-Type', 'text/plain')
      .send('Missing book description');
  }
  if (!newBook.cover_url || newBook.cover_url.trim() === "") {
    return res
      .status = 400
      .set('Content-Type', 'text/plain')
      .send('Missing book cover URL');
  }
  if (isNaN(newBook.author_id)){
    return res
      .status = 400
      .set('Content-Type', 'text/plain')
      .send('Improper author id');
  }

  knex('authors')
    .where('id', newBook.author_id)
    .first()
    .then((author) => {
      if (!author) {
        return res
          .status = 400
          .set('Content-Type', 'text/plain')
          .send('Invalid author id');
      }
      return knex('books')
      .insert(req.body, '*')
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

// req.body = bookChanges
// if (attribute) then change attribute
// vaildate authorid

router.patch('/books/:id', (req, res, next) => {
  const id = parseInt(req.params.id);
  const title = req.body.title;
  const genre = req.body.genre;
  const description = req.body.description;
  const cover_url = req.body.cover_url;
  let author_id = parseInt(req.body.author_id);
  let bookEdit = {};

  if (isNaN(id)) {
    return next();
  }

  knex('books')
    .where('id', id)
    .first()
    .then((book) => {
      if (!book) {
        return next();
      }
      bookEdit.title = title || book.title;
      bookEdit.genre = genre || book.genre;
      bookEdit.description = description || book.description;
      bookEdit.cover_url = cover_url || book.cover_url;
      if (!author_id) {
        author_id = book.author_id;
      }
      return knex('authors')
        .where('id', author_id)
        .first()
        .then((author) => {
          if (!author) {
            return next();
          }
          bookEdit.author_id = author_id;
          return knex('books')
            .update(bookEdit, '*')
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
    })
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
