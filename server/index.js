const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const uuid = require('uuid/v1');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

require('./models/Thunder');
require('./models/Order');
const Thunder = mongoose.model('Thunder');
const Order = mongoose.model('Order');

require('dotenv').config();

mongoose.connect(process.env.DATABASE);

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
  const orders = await Order.find({});
  res.json(orders).status(200);
  // return;
});

app.post('/api/orders', async (req, res) => {
  let order = new Order;
  order.thunder_name = req.body.thunder_name;
  order.recipient = '@'+req.body.recipient;
  order.meta.id = uuid();
  await order.save();
  res.send(order).status(200);
  // return;
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
app.get('/main.js', (req, res) => {
  res.sendFile(path.join(__dirname+'/../public/main.js'));
});

app.listen(process.env.PORT || 8080, function(){
  console.log("Running on port %d in %s mode", this.address().port, app.settings.env);
  console.log(process.env.NODE_ENV);
  
});