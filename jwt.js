const jwt = require('jsonwebtoken');
const jwtAuthMiddleware = (req,res,next) => {
  // first check whether request header has authorization or not
  
  const authorization = req.headers.authorization;
  if(!authorization)
  res.status(401).json({error:'Token not found'});

  
  // extract the jwt token from request headers
  const token = req.headers.authorization.split(' ')[1]; // hum token as header me as authencation pass karte h uska format esa rehta h "bearer token" to yaha hamne split se bearer ko or token ko alag alag kar liya ,bearer index 0 me chala gaya or token index 1 me aa gya

  //maaan lo token nahi mila tab
  if(!token){
    return res.status(401).json({error:'unauthorized'});
  }
  // yaha aa gye matlab token mil gya h 
  try{
     //verify the jwt token
     const decoded = jwt.verify(token,process.env.JWT_SECRET);

     // hamare pass jo token aaega wo decoded form me he to aaega

     // Attach user information to the request object
     req.user = decoded; // used in person/profile routes where the decoded token basically contain userid and username that is store in user and used in /person/profile
     next();

  }catch(err){
    console.log(err);
    res.status(401).json({error:'invalid token'});
  }

}


// function to genrate JWT token
const genrateToken = (userdata)=>{
  // Genrate a new JWT token using user data here userdata is payload
  return jwt.sign(userdata,process.env.JWT_SECRET,{expiresIn:60000});// ye token 30 second me expire ho jaaega

}


module.exports = {jwtAuthMiddleware,genrateToken}

