const express = require('express');
const IPLocate = require('./IPGeolocation')
const app = express();
require('dotenv').config();


app.get('/api/location/:id', async(req, res) =>{
  
   
     const result = await IPLocate.Locate(req.params.id);
  
  res.send(result);
});
app.get('/api/ipAddress', async(req, res) =>{
  
   
  let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  ip = ip.toString().replace('::ffff:', '');  
  res.send({ip:ip});
});
app.get('/api/locations/noip', async(req, res) =>{
  
   
  let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  ip = ip.toString().replace('::ffff:', '');  
  const result = await IPLocate.Locate(ip);
  
  res.send(result);
});
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}...`));