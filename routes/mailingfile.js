const { Router} = require('express');
const router = Router();
const {auth, authAdmin} = require('../Middleware/middAuth');
//const fs = require('fs');
const multer = require('multer');
const clientSchema = require('../models/clientmodel');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });





router.get('/', async (req, res) => {
    const ClientList = await ['option 1', 'option 2', 'option 3'];
    res.render('./mailingfile/index', { ClientList });
  });

  router.post('/', upload.single('fileInput'), (req, res) => {
    console.log(req.body);
    const fileContent = req.file.buffer.toString('utf-8');
    console.log('File content:', fileContent);
    // Rest of your code
});

//-----------


router.get('/clients', async (req,res)=>{
  const clients = await clientSchema.find();

  res.render('./mailingfile/ClientList', {clients})
})

router.get('/newclient', async (req,res)=>{
  res.render('./mailingfile/newclient')
})

router.post('/newclient', async (req,res)=>{
  try{
    const client = new clientSchema({
      clientsname: req.body.clientsname
    
    })

    await client.save();
    res.redirect('/mailingfile/clients')

  }catch(err){
    res.send(err)
  }
  
})

router.get('/:id', async (req,res)=>{
  const id = req.params.id;
  console.log(req.body)
  //const clientsname = req.params.clientsname;
  res.send(id)
})

module.exports = router;