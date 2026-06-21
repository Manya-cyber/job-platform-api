const jwt = require('jsonwebtoken');

function authentication(req,res,next){

    const authHeader= req.headers.authorization;
      const token = authHeader && authHeader.split(' ')[1];

    if(!token){
        return res.status(401).json({"error" :"no token found"});
    }
   


     try{
          const decoded = jwt.verify(token,process.env.JWT_SECRET);
                req.user = decoded ;
      next();

     }catch(error){
         return res.status(401).json({"error" : "INVALID TOKEN"})

     }

  

    


}

module.exports = authentication;