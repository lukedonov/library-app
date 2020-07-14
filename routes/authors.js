const express = require('express')
const router = express.Router()
const Author = require('../models/author')


router.get('/', async(req, res) => {
  let searchOptions = {}
  if (req.query.name != null && req.query.name !== '') {
    searchOptions.name = new RegExp(req.query.name, 'i')
  }
  try {
    const authors = await Author.find(searchOptions)
    res.render('authors/index', {
      authors: authors,
      searchOptions: req.query
    })
  } catch {
    res.redirect('/')
  }
}) 

router.get('/new', (req, res) => {
  res.render('authors/new', {author: new Author() })
})

router.post('/', async(req, res) => {
  const author = new Author({
    name: req.body.name
  })
  try {
    const newAuthor = await author.save()
    res.redirect(`/authors/${newAuthor.id}`)
  } catch {
      const locals = {
        author: author,
        errorMessage: 'Error creating author'
      }
      res.render('authors/new', locals)
  }
})

router.get('/:id', (req, res) => {
  res.send('Show author' + req.params.id)
})

router.get('/:id/edit', async (req, res) => {
  try {
    const author = await Author.findById(req.params.id)
    res.render('authors/edit', {author: author })
  } catch {
    res.redirect('/authors')
  }
})

router.put('/:id', async (req, res) => {
  let author
  try {
    author = await Author.findById(req.params.id)
    author.name = req.body.name
    await author.save()
    res.redirect(`/authors/${author.id}`)
  } catch {
    if (author === null) {
      res.redirect('/')
    } else {
      const locals = {
        author: author,
        errorMessage: 'Error updating author'
      }
      res.render('authors/edit', locals)
    }
  }
})

router.delete('/:id', async (req, res) => {
  let author
  try {
    author = await Author.findById(req.params.id)
    await author.remove()
    res.redirect(`/authors`)
  } catch {
    if (author === null) {
      res.redirect('/')
    } else {
      res.redirect(`/authors/${author.id}`)
    }
  }
})

module.exports = router