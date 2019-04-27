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
  res.sendStatus(401);
  
  res.set({
    'IFTTT-Service-Key': process.env.IFTTT_SERVICE_KEY,
    Accept: 'application/json',
    'Accept-Charset': 'utf-8',
    'Accept-Encoding': 'gzip, deflate',
    'X-Request-ID': uuid()
  });
  res.sendStatus(200);
});

app.post('/ifttt/v1/test/setup', (req, res) => {
  if(req.header('IFTTT-Service-Key') != process.env.IFTTT_SERVICE_KEY || req.header('IFTTT-Channel-Key') != process.env.IFTTT_SERVICE_KEY)
  res.sendStatus(401);
  
  res.header('Content-Type: application/json; charset=utf-8');

  res.status(200).json(
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
  res.header('Content-Type: application/json; charset=utf-8');
  res.status(200).json({
    data: [
      {
        "recipient": "@StreetArt",
        "thunder_name": "Blue thunder",
        "created_at": new Date().toISOString(),
        "meta": {
          "id": uuid(),
          "timestamp": Date.now() - 80
        }
      },
      {
        "recipient": "@Technology",
        "thunder_name": "Red thunder",
        "created_at": new Date().toISOString(),
        "meta": {
          "id": uuid(),
          "timestamp": Date.now() - 100
        }
      },
      {
        "recipient": "@Someone",
        "thunder_name": "Green thunder",
        "created_at": new Date().toISOString(),
        "meta": {
          "id": uuid(),
          "timestamp": Date.now() - 200
        }
      }

    ]
  });
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Running on port %d in %s mode", this.address().port, app.settings.env);
  
});