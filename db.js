const mongoose = require('mongoose');
require('dotenv').config();

// Define the mongodb url connection url

// const mongoURL = "mongodb://localhost:27017/hotels"; // Replace 'mydatabase with your database name to hamne usee hotel naam de diya h or jese he connection establish hoga to hotels name ka database create ho jaaega
const mongoURL = process.env.MONGODB_URL;

// set MongoDB connection
mongoose.connect(mongoURL);

// mongoose hamesa ek object bnake rakhta h jo ke responsible hota h connection establishment me 
// or isse db ka use karke apan node or mongo db me bridge establish karenge
const db = mongoose.connection;

// define eventlistner-->> kooi bhi database me change hota h to eventlistner usse observe karta rahtah h or uss observation se apan messages print kar sakte h like ('error') ('connected') ('disconnected')

// db ko connected , error,disconnected ka matlab pta hota h 

db.on('connected',()=>{
  console.log('connected to mongodb server')
});

db.on('error',(err)=>{
  console.log('MongoDB connection error',err)
});
db.on('disconnected',()=>{
  console.log('MongoDB disconnected')
});

module.exports = db;








