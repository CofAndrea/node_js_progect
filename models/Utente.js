const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs');

var UtenteSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Si prega di inserire un nome'],
        minlength: 3,
        maxlength: 50,
      },
    email:{
        type: String,
        unique: true,
        required: [true, 'Si prega di inserire una mail valida'],
        validate: {
          validator: validator.isEmail,
          message: 'Si prega di inserire una mail valida',
        },
      },
    password:{
        type: String,
        required: [true, 'Si prega di inserire una password'],
        minlength: 6,
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
      },
});

UtenteSchema.pre('save', async function () {
    // console.log(this.modifiedPaths());
    // console.log(this.isModified('name'));
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  });
  
  UtenteSchema.methods.comparePassword = async function (canditatePassword) {
    const isMatch = await bcrypt.compare(canditatePassword, this.password);
    return isMatch;
  };
  
module.exports = mongoose.model('Utente', UtenteSchema);