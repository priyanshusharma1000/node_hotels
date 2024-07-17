// ye apan ne npm se liye h 
const passport = require('passport');
const LocalStratergy = require('passport-local').Strategy;
const person = require('./models/person');


passport.use(new LocalStratergy(async(username,password,done)=>{
  // authentication logic here
  try{
      // console.log('Recieved credential:',USERNAME,password);
      const user = await person.findOne({username});
      if(!user)
      return done(null,false,{message:'Incorrect user'});

      const ispasswordmatch = await user.comparePassword(password);
      if(ispasswordmatch)
      return done(null,user);

      else
      return done(null,false,{message:'Incorrect password'});

  }catch(err){
     return done(err);
  }
}));
module.exports = passport;