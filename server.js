const express = require('express');
const app = express();

const expressLayouts = require('express-ejs-layouts')
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views' );
app.set('layout', 'layouts/layouts')
app.use(expressLayouts)
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.send('Hello world')
})

app.listen(process.env.PORT || PORT )