const express=require('express');
const router = express.Router();
const person = require('./../models/person');
const {jwtAuthMiddleware,genrateToken} = require('./../jwt');
// we want ke jese h user signup kare to turant ussse token mile
router.post('/signup',async(req,res)=>{
  try{
     const data = req.body// assume request bosy contain the person data

     // create a new person document using mongoose model

     const newPerson = new person(data);

     // save the new person to the database

     const response = await newPerson.save();
     console.log('data saved');

    //data save ho gya ab hum chahte h kiyahi hum token genrate karde
     const payload = {
      id:response.id,
      username:response.username
     }
     console.log(JSON.stringify(payload));
     const token = genrateToken(payload);
     console.log('Token is:',token);
     res.status(200).json({response:response,token:token});
  }
  catch(err){
    console.log(err);
    res.status(500).json({error:'internal server error'}) 

  }

})
// login route
router.post('/login',async (req,res)=>{
  try{
    // extract usrname and password
    const {username,password} = req.body;

    const user = await person.findOne({username:username});

    if(!user || !user.comparePassword(password)){
      return res.status(401).json({error:'invalid username or password'});
    }

    // user bhi sahi h password sahi h ab token genrate karte h 
    const payload = {
      id:user.id,
      username:user.username
    }
    const token = genrateToken(payload);
    // return token as response
    res.json({token});

  }catch(err){
     console.error(err);
     res.status(500).json({error:'internal server error'});
  }
});
// profile routes
router.get('/profile',jwtAuthMiddleware,async(req,res)=>{
  try{
     const userData = req.user;// token ko jwt website pe jaake dekh lo wo payload information carry karega here username and id + issue at and expire at we utilize this data 
     console.log("userdata :",userData);
     const userId = userData.id;
     const user = await person.findById(userId);
     res.status(200).json({user});
  }
  catch(err){
    console.error(err);
    res.status(500).json({error:'Internal server error'});
  }
})
// yaha apan ne upper token ke madad se userid nikali or userid se user or uska profile print kar diya

router.get('/',jwtAuthMiddleware,async(req,res)=>{
   try{
     const data = await person.find();
     console.log('data fetched');
     res.status(200).json(data);
   }
   catch(err){
    console.log(err);
    res.status(500).json({error:'internal server error'});
   }
})

router.get('/:worktype',async(req,res)=>{
  try{
  const worktype = req.params.worktype;// EXTRACT WORKTYPE FROM THE URL PARAMETER
  // yaha ab parametrize api bna rhe h maanlo kisi ne url daal diya loalhost:3000/person/chef  matlab user ko kevel chef ka data chahiye or maan lo user ne daal diya localhost:3000/person/manager to kya ham sabke liye end points create karenge ans is no since ye worktype pe differentiated h to apan :worktype variable se kaam chala lenge , jese he parameter change hota jaaega url bhi change hota jaaega

  if(worktype=='chef' || worktype=='waiter' || worktype=='manager'){
    // yaha validation laga dete h agar worktype in 3noo mese koi hoga to kaam karenge nahi to faltu he kyo database operation kare invalid worktype ke liye
    const response = await person.find({work:worktype});
    console.log('response fetched');
    res.status(200).json(response);
  }
  else{
      res.status(404).json({error:'invalid work type'})
  }
  }catch(err){
    console.log(err);
    res.status(500).json({error:'internal server error'});
  }
})

router.put('/:id',async(req,res)=>{
  try{
    const personId = req.params.id;// extract id fromt the url parameter
    const updatedPersonData = req.body;//update data for the person
    const response = await person.findByIdAndUpdate(personId,updatedPersonData,{
      new:true, // return the updated document
      runValidators:true// run mongoose validation
    })
    if(!response){
      res.status(404).json({error:'person not found'});
    }
    console.log('data updated');
    res.status(200).json(response);

  }catch(err){
    console.log(err);
    res.status(500).json({error:'internal server error'});
  }
})
router.delete('/:id',async(req,res)=>{
  try{
    const personId = req.params.id;

    const response = await person.findByIdAndDelete(personId);
    if(!response){
      res.status(404).json({error:'Person not found'});
    }
    console.log('data deleted');
    res.status(200).json({message:'person deleted successfully'});

  }catch(err){
    console.log(err);
    res.status(500).json({error:'internal server error'})
  }
})
module.exports=router;