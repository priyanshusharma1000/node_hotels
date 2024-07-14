const express=require('express');
const router = express.Router();
const person = require('./../models/person');


router.post('/',async(req,res)=>{
  try{
     const data = req.body// assume request bosy contain the person data

     // create a new person document using mongoose model

     const newPerson = new person(data);

     // save the new person to the database

     const response = await newPerson.save();
     console.log('data saved');
     res.status(200).json(response);
  }
  catch(err){
    console.log(err);
    res.status(500).json({error:'internal server error'}) 

  }

})

router.get('/',async(req,res)=>{
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