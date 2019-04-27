const path = require('path');
const express = require('express');
const uuid = require('uuid/v1');
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

app.get('/ifttt/v1/status', (req, res) => {
  res.set({
    'IFTTT-Service-Key': process.env.IFTTT_SERVICE_KEY,
    Accept: 'application/json',
    'Accept-Charset': 'utf-8',
    'Accept-Encoding': 'gzip, deflate',
    'X-Request-ID': uuid()
  });
  res.sendStatus('200');
});

app.post('/ifttt/v1/triggers/get_thunders', (req, res) => {
  res.send('ok');
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Running on port %d in %s mode", this.address().port, app.settings.env);
  
});