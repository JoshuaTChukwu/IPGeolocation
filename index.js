const express = require('express');
const IPLocate = require('./IPGeolocation')
const app = express();


app.get('/api/:id', async(req, res) =>{
    console.log(req.params.id)
     const result = await IPLocate.Locate(req.params.id);
     console.log(result)
  res.send(result);
});
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));