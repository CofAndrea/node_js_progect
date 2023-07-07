const mongoose = require('mongoose');

var ProdottoSchema = new mongoose.Schema({
    name:{
        type:String,
        trim: true,
        required: [true, 'inserire nome prodotto'],
        maxlength: [100, 'il nome non può essere più lungo di 100 caratteri'],
    },
    price: {
        type: Number,
        required: [true, 'inserire prezzo'],
        default: 0,
      },
      description: {
        type: String,
        required: [true, 'inserire descrizione'],
        maxlength: [1000, 'la descrizione non può superare i 1000 caratteri'],
      },
      image: {
        type: String,
        default: '/uploads/example.jpeg',
      },
      freeShipping: {
        type: Boolean,
        default: false,
      }, 
      inventory: {
        type: Number,
        required: true,
        default: 1,
      },
      user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
      },
}, {
    timestamps: true
});

//Export the model
module.exports = mongoose.model('Prodotto', ProdottoSchema);