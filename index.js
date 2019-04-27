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
  if(req.header('IFTTT-Service-Key') != process.env.IFTTT_SERVICE_KEY)
  res.sendStatus('500');
  
  res.set({
    'IFTTT-Service-Key': process.env.IFTTT_SERVICE_KEY,
    Accept: 'application/json',
    'Accept-Charset': 'utf-8',
    'Accept-Encoding': 'gzip, deflate',
    'X-Request-ID': uuid()
  });
  res.sendStatus('200');
});

app.get('/ifttt/v1/test/setup', (req, res) => {
  if(req.header('IFTTT-Service-Key') != process.env.IFTTT_SERVICE_KEY || req.header('IFTTT-Channel-Key') != process.env.IFTTT_SERVICE_KEY)
  res.sendStatus('500');
  
  res.header('Content-Type: application/json; charset=utf-8');

  res.status('200').json(
    {
      "data": {
        // "accessToken": "taSvYgeXfM1HjVISJbUXVBIw1YUkKABm",
        "samples": {
          // "triggers": {
          //   "any_new_photo_in_album": {
          //     "album": "Italy"
          //   }
          // },
          // "triggerFieldValidations": {
          //   "any_new_photo_in_album": {
          //     "album": {
          //       "valid": "Italy",
          //       "invalid": "AlbumDoesNotExist"
          //     }
          //   }
          // },
        }
      }
    }
  );
});

app.post('/ifttt/v1/triggers/get_thunders', (req, res) => {
  res.send('ok');
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Running on port %d in %s mode", this.address().port, app.settings.env);
  
});