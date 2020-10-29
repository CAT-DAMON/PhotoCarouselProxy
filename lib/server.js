require('newrelic');
const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();
const host = process.env.HOST || 'localhost';
const port = process.env.PORT || '3000';
const servicePort = process.env.SPORT || '3003';
const serviceHost = process.env.SHOST || 'localhost';

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static('lib'))
app.use('/listing', express.static(path.join(__dirname, 'lib')));
// app.use('/listing/:itemId', express.static(path.join(__dirname, 'index.html')))

// app.get('/', (req, res) => {
//   res.redirect('/listing/1');
// })

app.get('/listing/:productId', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/listing/:productId', (req, res) => {
  axios.get(`http://${serviceHost}:${servicePort}/api/listing/${req.param('productId')}`).then((results) => {
    res.send(results.data);
  }).catch((error) => {
    res.send(error);
  })
})

app.post('/api/listing', (req, res) => {
  axios.post(`http://${serviceHost}:${servicePort}/api/listing`, req.body).then((results) => {
    res.send(results.data);
  }).catch((error) => {
    res.send(error);
  })
})

app.listen(port, () => {
  console.log(`Proxy listening at http://${host}:${port}`);
})
