const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { use } = require('../routes/main');
const schema = mongoose.Schema; 

const userSchema = new schema({
    FirstName: {
        type:String,
        required: true
    },
    LastName: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    Admin:{
        type: String,
        required: true
    },
    Phone:{
        type: Number,
        required: false
    },
    Password: {
        type: String,
        required: true

    }
    
},{timestamps: true});



//fire a function before
userSchema.post('save', async function(data, next){
    await console.log('USER CREATED')

 next();
})
//fire a function before
userSchema.pre('save', async function(next){
     
    console.log('USER IS ABOUT TO BE CREATED')
    const salt = await bcrypt.genSalt();
    this.Password = await bcrypt.hash(this.Password, salt)
    

    console.log(this.Password);
  

 next();
})



userSchema.pre('findOneAndUpdate', async function(next){
    console.log("THIS USER IS ABOUT TO BE UPDATED")
    
    const salt = await bcrypt.genSalt();
    this._update.Password = await bcrypt.hash(this._update.Password, salt)
    console.log(this._update.Password)
   
   

 next();
})

userSchema.statics.login = async function(email ,password){
    const Email = email;
   
    
    const user = await this.findOne({Email})

    if(user){
        const auth = await bcrypt.compare(password, user.Password);
        if(auth){
            return user
        }
        throw Error('Invalid Password!')
    }
    throw Error('Invalid Email!')

    
}



const User = mongoose.model('User', userSchema);

module.exports = User;