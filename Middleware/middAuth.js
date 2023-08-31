const jwt = require('jsonwebtoken');
const userModel = require('../models/usermodel');

const auth = function(req, res, next) {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, 'Elovate2023!', async (err, decodedToken) => {
      if (err) {
        //console.log(err.message);
        res.locals.user = null;
        res.redirect('/');
      } else {
        //console.log(decodedToken);
        let user = await userModel.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    res.redirect('/');
  }
};

const authAdmin = function (req,res,next){
  const token = req.cookies.jwt;
  if(token){
    jwt.verify(token, 'Elovate2023!', async (err, decodedToken)=>{
      if(err){
        res.locals.user = null;
        res.redirect('/');
      }
      else{
      //let user = await userModel.findById(decodedToken.id);                           
      console.log('something is out'+ decodedToken.id)
      let user = await userModel.findById(decodedToken.id);
      const prm = user.Admin
      if(prm == 'yes'){
        console.log('CURRENT USER DOES HAVE PERSMISSIONS')
        res.locals.user = user;
        next();
      }
      else{
        res.locals.user = null;
        console.log('CURRENT USER DOESNT HAVE PERMISSION')
        res.send('You dont have permissions')
      }
     
      
      }
      
    })

  }
  else{
    res.redirect('/');
  }

}

module.exports = { auth, authAdmin };
