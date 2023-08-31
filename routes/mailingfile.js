const { Router} = require('express');
const router = Router();
const {auth, authAdmin} = require('../Middleware/middAuth');






router.get('/', async (req, res) => {
    const ClientList = await ['option 1', 'option 2', 'option 3'];
    res.render('./mailingfile/index', { ClientList });
  });

router.post('/', async (req,res)=>{
    console.log('work')
})


  

module.exports = router;