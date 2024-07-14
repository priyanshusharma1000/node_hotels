const express = require('express');
const app = express();
const db = require('./db');

const bodyParser = require('body-parser');
app.use(bodyParser.json());//body parser kisi bhi type of data like json , url coded,raw data ko process karke javascript object me convert karta h  yaha apan keval json data pe game khel rhe h isliye hamne bodyparser.json() use kiya or body-parser ka output req.body me store hoga
const person = require('./models/person');


app.get('/',function(req,res){
  res.send('Welcome to my hotel...How can i help you');
})
/*
app.get('/chicken',(req,res)=>{
  res.send('Sure sir i would love to serve chicken');
})

app.get('/idli',(req,res)=>{
  var customize_idli={
    name:'rava_idli',
    size:'10 cm diameter',
    issambhar:true,
    ischutney:false
  }
  res.send(customize_idli);
})
*/
// import the router files
const personRoutes = require('./routes/personRoutes');
//use the routers
app.use('/person',personRoutes);

app.listen(3000,()=>{
  console.log('listening on port 3000')
})