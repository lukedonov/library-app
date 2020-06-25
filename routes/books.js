const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const Book = require('../models/book')
const Author = require('../models/user')
const { fstat } = require('fs')
const uploadPath = path.join('public', Book.coverImageBasePath)
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']
const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, imageMimeTypes.includes(file.mimetype))
  }
})

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

// router.get('/', async(req, res) => {
//   let searchOptions = {}
//   if (req.query.name != null && req.query.name !== '') {
//     searchOptions.name = new RegExp(req.query.name, 'i')
//   }
//   try {
//     const books = await Book.find(searchOptions)
//     const authors = await Author.find(searchOptions)
//     res.render('books/index', {
//       books: books,
//       authors: authors,
//       searchOptions: req.query
//     })
//   } catch {
//     res.redirect('/')
//   }
// }) 

router.get('/new', async(req, res) => {
  renderNewPage(res, new Book())
})

router.post('/', upload.single('cover'), async(req, res) => {
  const fileName = req.file != null ? req.file.filename : null
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    coverImage: fileName,
    description: req.body.description
  })

  try {
    const newBook = await book.save()
    res.redirect('books')
  } catch {
    renderNewPage(res, book, true)
    if (book.coverImage != null){
      removeCoverImage(fileName)
    }
  }
})

async function renderNewPage(res, book, hasError = false) {
  try {
    const authors = await Author.find({})
    const params = {
      authors: authors,
      book: book
    }
    if(hasError) params.errorMessage = "Error creating book"
    res.render('books/new', params)
  } catch {
    res.redirect('books')
  }
}

function removeCoverImage(fileName) {
  fs.unlink(path.join(uploadPath, fileName), err => {
    if (err) console.error(err)
  })
}

module.exports = router