const express = require('express')
const router = express.Router()
const Book = require('../models/book')

router.get('/', async (req, res) => {
  try {
    const books = await Book.find().sort({createdAt: 'desc' }).limit(4).exec()
  } catch {
    books = []
  }
  res.render('index', { books: books })
})

module.exports = router