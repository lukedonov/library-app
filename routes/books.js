const express = require('express')
const router = express.Router()
const Book = require('../models/book')


router.get('/', async(req, res) => {

}) 

router.get('/new', (req, res) => {
  // res.render('books/new', {book: new Book() })
})

router.post('/', async(req, res) => {

})

module.exports = router