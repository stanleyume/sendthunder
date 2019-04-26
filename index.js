const path = require('path');
const express = require('express');
const app = express();

require('dotenv').config();

const thunder = require('./thunder');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.get('/', (req, res) => {
  
  // res.send('Hello World');
  res.render('index.pug');
});

app.get('/email', (req, res) => {
  thunder.thunder2('Tweet from app');

  res.send('done');
});

app.listen('3000', ()=>{
  console.log('Japa');
  
});