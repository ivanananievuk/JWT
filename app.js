const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

const Router = require('./routes/main');
//const MailingFile = require('./routes/mailingfile');

const cookies = require('cookie-parser');
const userModel = require('./models/usermodel');
const currentUser = 0;
let theCode;
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

app.get('/register',(req, res) => res.render('register'));
app.post('/register', async (req, res) => {


  function runForFiveMinutes() {                //This generates a random 6 digit code and deletes i after 5 min

const generateRandomNumber = function() {                             //the part that is creating the number or the act function
  
    const randomNumber = Math.floor(Math.random() * 1000000);         //It generate a number between 0&1 and x1000000
    const formattedNumber = randomNumber.toString().padStart(6, '0');  //it takes only the first 6 digits and convers then to a string
    theCode = formattedNumber;                                         // setting it to the global var so the other functions can access it 
    console.log("Generated Number:", theCode);      //you can delete this line of code it's for demonstration
};
generateRandomNumber();


   
    
    setTimeout(function() {                            //creating a timing bomb so the global var wil expire
        theCode = 0;   
        console.log("Session has expired");
    }, 300000); // 300,000 milliseconds = 5 minutes
}

runForFiveMinutes();

// This is where we actually send the email 

const html = `
Your verification code is ${theCode}.
`;


async function mainMail() {
  const transporter = nodemailer.createTransport({
    host: 'smtp.mail.yahoo.com',
    port: 465,
    secure: true,
    auth: {
      user: 'ivanananievuk@yahoo.com',
      pass: 'brcvijbdpwqyymvb'
    },
  });

  const info = await transporter.sendMail({
    from: 'Ivan <ivanananievuk@yahoo.com>',
    to: 'iananiev83@gmail.com',
    subject: 'Verification Code',
    html: html,
  });

  console.log('Message sent:', info.messageId);
}

mainMail();




   const data = req.body;               //if everything is correct
   res.render('verify',  data );

   

});

app.get('/verify',(req, res) => res.render('verify'));

//app.post('/verify', (req,res)=>{res.send(req.body)})
app.post('/verify', (req,res)=>{
  console.log(req.body)
  if (req.body.code == theCode) {
    res.send('The code is the same we can create the account')
  } else {
    res.send('Incorrect code')

  }
})





app.use('/main',Router);

//app.use('/main/users', userRouter);
//Ivan
//just a test