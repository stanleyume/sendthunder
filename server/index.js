const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const uuid = require('uuid/v1');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const moment = require('moment');

require('./models/Thunder');
require('./models/Order');
const Thunder = mongoose.model('Thunder');
const Order = mongoose.model('Order');

require('dotenv').config();

mongoose.connect(process.env.DATABASE, { useNewUrlParser: true });

const thunder = require('./thunder');

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Serve static files from the React App
app.use(express.static(path.join(__dirname, 'public')));

// app.use(express.static(__dirname +'../public'));

// app.set('views', path.join(__dirname, '../views'));
// app.set('view engine', 'pug');

// app.get('/', (req, res) => {
  
//   // res.send('Hello World');
//   res.sendFile(path.join(__dirname, '../public/index.html'));
//   // res.render('index.pug');
// });

// app.get('/email', (req, res) => {
//   thunder.thunder2('Tweet from app');

//   res.send('done');
// });

// Store new thunder
app.post('/api/thunders', async (req, res)=>{
  const dupes = await Thunder.find({name: req.body.name});

  if(!dupes || dupes == ''){
    const thunder = await new Thunder(req.body)
    await thunder.save();
    res.send(thunder).status(200);
  } else {
    res.sendStatus(403);
  }
});
// Get thunders
app.get('/api/thunders', async (req, res)=>{
  const thunders = await Thunder.find({})
  res.send(thunders).status(200);
});

app.get('/api/orders', async (req, res) => {
  const orders = await Order.find({}).sort({ 'meta.timestamp': -1 }).limit(20);
  res.json(orders).status(200);
  // return;
});

app.post('/api/orders', async (req, res) => {
  // No more requests
  // res.statusMessage = "Please try again later. All thunders have been summoned for a general meeting.";
  // return res.sendStatus(403);

  // Get orders sent today
  // const orders_today = await Order.find({ '$where': 'this.created_at.slice(0, 10) == new Date().toISOString().slice(0, 10)' }).sort({ 'meta.timestamp': -1 });

  let sent_today = await Order.sentToday();
  if (sent_today.length >= 95) {
      res.statusMessage = "Please try again later. All thunders have been summoned for a general meeting.";
      return res.sendStatus(403);
  }

  let { thunder_name, recipient } = req.body;
  thunder_name = thunder_name.replace(/<[^>]*>?/gm, '');
  recipient = recipient.replace(/<[^>]*>?/gm, '');
  recipient = recipient.replace(/@/g, '');
  recipient = recipient.toLowerCase();
  if(recipient.length > 15 || recipient.length < 2 || recipient.indexOf('sendthunder') !== -1){
    res.statusMessage = 'Invalid Twitter handle';
    return res.sendStatus(403);
  }
  if(thunder_name == ''){
    res.statusMessage = 'Invalid Thunder name';
    return res.sendStatus(403);
  }

  let order = new Order;
  order.thunder_name = thunder_name;
  order.recipient = '@'+recipient;
  order.meta.id = uuid();
  await order.save();
  res.statusMessage = "Thunder dispatched! Will be delivered shortly.";
  res.send(order).status(200);
  // return;

});

// How many today?
app.get('/api/orders/count', async (req, res) => {
  try {
    let sent_today = await Order.sentToday();
    let count = sent_today.length.toString();
    return res.status(200).send(count);
  } catch (error) {
    res.statusMessage = error;
    return res.sendStatus(403);
  }
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

app.post('/ifttt/v1/triggers/get_thunders', async (req, res) => {
  if((req.header('IFTTT-Service-Key') != process.env.IFTTT_SERVICE_KEY) && (req.header('IFTTT-Channel-Key') != process.env.IFTTT_SERVICE_KEY))
  res.status(401).json({
    "errors": [
      {
        "message": "Something went wrong!"
      }
    ]
  });

  // res.header('Content-Type: application/json; charset=utf-8');
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('charset', 'utf-8');

  let items = await Order.find({}).sort({ 'meta.timestamp': -1 });

  // let items = [
  //   {
  //     "recipient": "@umestanley",
  //     "thunder_name": "Blue thunder",
  //     "created_at": new Date().toISOString(),
  //     "meta": {
  //       "id": uuid(),
  //       "timestamp": parseInt((new Date('2019.04.10').getTime() / 1000).toFixed(0))
  //     }
  //   },
  //   {
  //     "recipient": "@amdbafrica",
  //     "thunder_name": "Red thunder",
  //     "created_at": new Date().toISOString(),
  //     "meta": {
  //       "id": uuid(),
  //       "timestamp": parseInt((new Date('2019.04.05').getTime() / 1000).toFixed(0))
  //     }
  //   },
  //   {
  //     "recipient": "@techwonda",
  //     "thunder_name": "Green thunder",
  //     "created_at": new Date().toISOString(),
  //     "meta": {
  //       "id": uuid(),
  //       "timestamp": parseInt((new Date('2019.04.01').getTime() / 1000).toFixed(0))
  //     }
  //   }

  // ];

  if (req.body.limit >= 0) {
    items = items.slice(0, req.body.limit);
  }
  
  res.status(200).json({
    data: items
  });
});

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../public/index.html'));
// });

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname+'/../public/index.html'));
});
app.get('/public/main.js', (req, res) => {
  res.sendFile(path.join(__dirname+'/../public/main.js'));
});
app.get('/lightning.jpg', (req, res) => {
  res.sendFile(path.join(__dirname+'/../public/lightning.jpg'));
});
app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname+'/../public/favicon.ico'));
});

app.listen(process.env.PORT || 8080, function(){
  console.log("Running on port %d in %s mode", this.address().port, app.settings.env);
  console.log(process.env.NODE_ENV);
  
});