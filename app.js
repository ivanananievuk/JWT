const express = require('express');
const mongoose = require('mongoose');

const Router = require('./routes/main');
//const MailingFile = require('./routes/mailingfile');

const cookies = require('cookie-parser');
const userModel = require('./models/usermodel');
const currentUser = 0;
const jwt = require('jsonwebtoken');
const {auth} = require('./Middleware/middAuth');

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(cookies());
app.use(express.json());


// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb+srv://123:123@cluster0.5ux9hek.mongodb.net/';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

// routes
app.get('/',(req, res) => res.render('home'));


app.post('/', async (req, res) => {
  const { email, password } = req.body;
  //console.log('Received data:', { email, password });

  const maxAge = 3 * 24 * 60 * 60;
  const createToken = (id) => {
  return jwt.sign({ id }, 'Elovate2023!', {
    expiresIn: maxAge
  });
  };

  try{
    const user = await userModel.login(email,password);
    //res.status(200).json({user: user._id})
     
    const token = createToken(user._id);
    console.log(token)
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000});
   
    res.status(200).json({user: user._id})
    
    
  }
  catch(err){
    const issue = err.message;
    res.status(400).json({issue});
  }

 
});





app.use('/main',Router);

//app.use('/main/users', userRouter);
//Ivan