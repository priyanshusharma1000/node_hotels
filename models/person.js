const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
//define schema
const personSchema = new mongoose.Schema({
   name: {
    type:String,
    required:true
   },
   age:{
    type:Number,
   },
   work:{
    type:String,
    enum:['chef','waiter','manager'],
    required:true
   },
   mobile:{
   type:String,
   required:true
   },
   email:{
    type:String,
    unique:true,
    required:true
   },
   address:{
    type:String
   },
   salary:{
     type:Number,
     required:true
   },
   username:{
    required:true,
    type:String
   },
   password:{
    required:true,
    type:String,
    unique:true
   }
});


/*pre ek middleware function jo ke jab hum save karne wale honge tab trigger hoga*/
/* next ek callbackback function h ye mongoose ko signal de rha h ke ab aap save kardo*/
personSchema.pre('save',async function(next){
  const person = this;
  // hash the password only if ith has been modified(or it is new)
  if(!person.isModified('password')) return next();
  try{
    // hash password genration
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(person.password,salt);
    //override the plain password with the hashed one
    person.password = hashedpassword;
    next();
    // next moongoose ko ye btata he ke hamne aapna kaam kar liya ab tum tumhara kar lo
  }catch(err){
     return next(err);
  }

});


personSchema.methods.comparePassword = async function(candidatePassword){
  try{
   // use bcrypt to compare the provided password with the hashed password
   const isMatch = await bcrypt.compare(candidatePassword,this.password);
   return isMatch;
  }
  catch(err){
    throw err;
  }
}

// create person model
const person = mongoose.model('person',personSchema);

module.exports = person;
 