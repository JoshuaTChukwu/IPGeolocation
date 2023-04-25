const express = require('express');
const IPLocate = require('./IPGeolocation')
const University = require('./University')
const app = express();
require('dotenv').config();


app.get('/api/location/:id', async(req, res) =>{
  
   
     const result = await IPLocate.IPModule.Locate(req.params.id);
  
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
  const result = await IPLocate.IPModule.Locate(ip);
  
  res.send(result);
});
app.get('/api/countries/get/all', async(req,res)=>{
  let result = await IPLocate.IPModule.getAllCountry();
  res.send(result);
});
app.get('/api/city/get/all/by/country/:code', async(req,res)=>{
  let result = await IPLocate.IPModule.getCityByCountry(req.params.code);
  res.send(result);
});
app.get('/api/country/get/one/by/country/:code', async(req,res)=>{
  let result = await IPLocate.IPModule.getOneCountry(req.params.code);
  res.send(result);
});
app.get('/api/universities/get/all', async(req,res)=>{
  let result = await University.UniversityModule.getAllUniversities();
  res.send(result);
});
app.get('/api/universities/get/countryCode/:code', async(req, res) =>{
  
  console.log(req.params.code); 
  const result = await University.UniversityModule.getUniversitiesByCountry(req.params.code);

res.send(result);
});
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}...`));