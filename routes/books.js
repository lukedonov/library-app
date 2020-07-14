const express = require('express')
const router = express.Router()
const Book = require('../models/book')
const Author = require('../models/author')
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']

router.get('/', async(req, res) => {
  let query = Book.find()
  if (req.query.title != null && req.query.title != ""){
    query = query.regex('title', new RegExp(req.query.title, 'i'))
  }
  if (req.query.publishedBefore != null && req.query.publishedBefore != ""){
   query = query.lte('publishDate', req.query.publishedBefore )
  }
  if (req.query.publishedAfter != null && req.query.publishedAfter != ""){
    query = query.gte('publishDate', req.query.publishedAfter )
  }
  try {
    const books = await query.exec()
    res.render('books/index', {
      books: books,
      searchOptions: req.query,
    })
  } catch {
    res.redirect('/')
  }
}) 

router.get('/new', async (req, res) => {
  renderNewPage(res, new Book())
})

router.post('/', async (req, res) => {
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    description: req.body.description
  })
  saveCover(book, req.body.cover)

  try {
    const newBook = await book.save()
    // res.redirect(`books/${newBook.id}`)
    res.redirect(`books`)
  } catch {
    renderNewPage(res, book, true)
  }
})

async function renderNewPage(res, book, hasError = false) {
  try {
    const authors = await Author.find({})
    const params = {
      authors: authors,
      book: book
    }
    if (hasError) params.errorMessage = 'Error Creating Book'
    res.render('books/new', params)
  } catch {
    res.redirect('/books')
  }
}

function saveCover(book, coverEncoded) {
  if (coverEncoded == null) return
  const cover = JSON.parse(coverEncoded)
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    book.coverImage = new Buffer.from(cover.data, 'base64')
    book.coverImageType = cover.type
  }
}

router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('author').exec()
    res.render('books/show', {
      book: book
    })
  } catch {
    res.redirect('/')  
  }
})

router.get('/:id/edit', async (req, res) => {
  try {
    const authors = await Author.find({})
    const book = await Book.findById(req.params.id)
    res.render('books/edit', ({
      book: book,
      authors: authors
    }))
  } catch {
    res.render('/')
  }
})

router.put('/:id', async (req, res) => {
  let book
  try {
    book = await Book.findById(req.params.id)
    book.title = req.body.title
    book.pageCount = req.body.pageCount
    book.description = req.body.description
    await book.save()
    // res.redirect(`/book/${book.id}`)
    res.redirect(`/books`)
  } catch {
    if (book === null) {
      res.redirect('/')
    } else {
      const locals = {
        book: book,
        authors: authors,
        errorMessage: 'Error updating author'
      }
      res.render('books/edit', locals)
    }
  }
})

router.delete('/:id', async (req, res) => {
  let book
  try {
    book = await Book.findById(req.params.id)
    const author = await Author.findById(book.author)
    await book.remove()
    res.redirect('/books')
  } catch {
    res.redirect('/')
  }
})

module.exports = router