const express = require('express');
const app = express();

require('dotenv').config();

app.get('/', (req, res) => {
  
  res.send('Hello World');
});

app.get('/email', (req, res) => {

});

app.listen('3000', ()=>{
  console.log('Japa');
  
});