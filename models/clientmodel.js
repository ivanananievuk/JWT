const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
//const { use } = require('../routes/main');
const schema = mongoose.Schema; 

const clientSchema = new schema({
    clientsname:{
        type: String,
        required: true,
        uppercase: true,
        unique: true

    }
},{timestamps: true})

const Clients = mongoose.model('Client', clientSchema);

module.exports = Clients;
