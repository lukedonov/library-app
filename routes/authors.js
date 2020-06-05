const express = require('express')
const router = express.Router()
const Author = require('../models/user')


router.get('/', (req, res) => {
  res.render('authors/index')
}) 

router.get('/new', (req, res) => {
  res.render('authors/new', {author: new Author() })
})

router.post('/', (req, res) => {
  const author = new Author({
    name: req.body.name
  })
  author.save((err, newAuthor) => {
    if (err) {
      const locals = {
        author: author,
        errorMessage: 'Error creating author'
      }
      res.render('authors/new', locals)
    } else {
      res.redirect('/authors')
    }
  }) 
})

module.exports = router