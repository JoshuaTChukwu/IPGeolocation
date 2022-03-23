const express = require('express');
const IPLocate = require('./IPGeolocation')
const app = express();
require('dotenv').config();


app.get('/api/:id', async(req, res) =>{
    console.log(req.params.id)
    const rev = await IPLocate.updateDb();
     console.log(rev);
     const result = await IPLocate.Locate(req.params.id);
     console.log(result)
  res.send(result);
});
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}...`));