const { Router} = require('express');
const router = Router();
const userModel = require('../models/usermodel');
const {auth, authAdmin} = require('../Middleware/middAuth');

router.get('/', auth, (req,res)=> res.render('main'))

router.get('/logout',(req,res)=>{ res.cookie('jwt', '', {maxAge: 1})
res.redirect('/')
})
       




//users
//router.get('/users', auth, async (req,res)=>{
//
//    await userModel.find()
//    .then((result)=>{
//        res.render('./users/users', {result})
//
//    })
//    
//    //res.render('./users/users')
//})

router.get('/users', auth, async (req, res) => {
  try {
      const result = await userModel.find();
     // console.log(result); // Check if the result contains the newly created user
      res.render('./users/users', { result });
  } catch (error) {
      console.error(error);
      // Handle error if any
  }
});




router.get('/newuser', auth, (req,res)=>{
    const pass = 'password'
    res.render('./users/newuser', {pass})
})

//router.post('/newuser', auth, async(req,res)=>{
//
//   // res.send(req.body)
//    const user = await new userModel({
//        FirstName: req.body.firstName,
//        LastName:req.body.lastName,
//        Email: req.body.email,
//        Admin: req.body.admin,
//        Phone: req.body.phone,
//        Password: req.body.password
//    });
//
//    await user.save()
//    .then(res.redirect('/main/users'))
//})

router.post('/newuser', authAdmin, async (req, res) => {
  try {
      const user = new userModel({
          FirstName: req.body.firstName,
          LastName: req.body.lastName,
          Email: req.body.email,
          Admin: req.body.admin,
          Phone: req.body.phone,
          Password: req.body.password
      });

      await user.save();
     // console.log('User created:', user);

      res.redirect('/main/users');
  } catch (error) {
      console.error(error);
      // Handle error if any
      res.redirect('/main/users'); // Redirect with error handling
  }
});




router.get('/:id', auth, (req,res)=>{
        const id = req.params.id;
       // res.send(id)
        userModel.findById(id)
        .then((result)=>{
            //res.send(result)
            res.render('./users/eachuser', {result})
        })
 

})

//router.post('/:id', (req,res)=>{
//    
//    res.send(req.body)
//})

router.post('/:id', authAdmin, async (req, res) => {
    try {
      const userId = req.params.id;
      const updatedData = {
        FirstName: req.body.firstName,
        LastName: req.body.lastName,
        Email: req.body.email,
        Admin: req.body.admin,
        Phone: req.body.phone,
        Password: req.body.password
        // Add other fields as needed
      };
  
      // Update the user based on the provided ID
      const updatedUser = await userModel.findByIdAndUpdate(userId, updatedData, {
        new: true, // Return the modified document
        useFindAndModify: false // To suppress deprecated warnings
      });
  
      if (!updatedUser) {
        return res.status(404).send('User not found');
      }
  
      // Redirect or send a response, based on your requirements
      // For example, redirect to the updated user's page:
      res.redirect(`/main/${userId}`);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error updating user');
    }
  });

  router.delete("/:id", authAdmin, async(req,res)=>{
    const TheID = req.params.id;
    userModel.findByIdAndDelete(TheID)
    .then(result=>
        res.json({redirect : '/main/users'})
    )
  })
  
  
  
  
  


module.exports = router;