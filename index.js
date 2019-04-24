const express = require('express');
const app = express();

require('dotenv').config();

const thunder = require('./thunder');

app.get('/', (req, res) => {
  
  res.send('Hello World');
});

app.get('/email', (req, res) => {
  thunder.thunder2('Tweet from app');

  res.send('done');
});

app.listen('3000', ()=>{
  console.log('Japa');
  
});