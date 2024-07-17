const express = require('express');
const app = express();
const db = require('./db');
require('dotenv').config();// server ko  pta h ke iske pass ek dotenv file h'
const passport = require('./auth');


const bodyParser = require('body-parser');
app.use(bodyParser.json());//body parser kisi bhi type of data like json , url coded,raw data ko process karke javascript object me convert karta h  yaha apan keval json data pe game khel rhe h isliye hamne bodyparser.json() use kiya or body-parser ka output req.body me store hoga
const person = require('./models/person');
const PORT = process.env.PORT || 3000;
// we are using below middleware function to log all the request(kis time pe konsa url hit hua)

//middleware function
const logRequest = (req,res,next) =>{
   console.log(`${new Date().toLocaleString()} Rquest Made to : ${req.originalUrl}`);
   next();// move to next phase
}
// sabhi routes me middleware use karne ke liye
app.use(logRequest);

app.use(passport.initialize());



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
const localAuthMiddleware = passport.authenticate('local',{session:false});
// import the router files
const personRoutes = require('./routes/personRoutes');
//use the routers
app.use('/person',personRoutes);



app.listen(PORT,()=>{
  console.log('listening on port 3000')
})
 // cooment added for testing
 
  