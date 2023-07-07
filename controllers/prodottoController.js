const Product = require('../models/Prodotto');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const path = require('path');

//creaProdotto
const createProduct = async(req,res) => {
    req.body.user = req.user.userId
    const product = await Product.create(req.body)
    res.status(StatusCodes.CREATED).json({product})
}

//cerca tutti i prodotti
const getAllProducts = async (req, res) => {
  const products = await Product.find({})
  res.status(StatusCodes.OK).json({products, count: products.length})
}

//cerca singolo prodotto
const getSingleProduct = async (req, res) => {
  const {id:productId} = req.params
  const product = await Product.findOne({_id: productId})
  if(!product){
    throw new CustomError.NotFoundError(`nessun prodotto con id: ${productId}`)
  }
  res.status(StatusCodes.OK).json({product})
}

//aggiorna prodotto
const updateProduct = async (req, res) => {
  const { id: productId} = req.params

  const product = await Product.findOneAndUpdate({_id: productId}, req.body, {
    new:true,
    runValidators: true
  })
 if(!product){
  throw new CustomError.NotFoundError(`nessun prodotto con id: ${productId}`)
 }
 res.status(StatusCodes.OK).json({product})
}

//cancella prodotto
const deleteProduct = async (req, res) => {
  const {id:productId} = req.params
  const product = await Product.findOne({_id:productId})
  if (!product) {
    throw new CustomError.NotFoundError(`nessun prodotto con id: ${productId}`);
  }
  await product.deleteOne(product)
  res.status(StatusCodes.OK).json({msg:'prodotto eliminato'})
}

//uploadImage
const uploadImage = async (req, res) => {
    const {id:productId} = req.params
    const imageFilePath = req.file.path
    // Retrieve the corresponding product
    const product = await Product.findOne({_id: productId})
    if (!product) {
      throw new CustomError.NotFoundError('prodotto non trovato')
    }
    product.image = imageFilePath;
    await product.save();
    res.json({ success: true, message: 'Immagine caricata' });
}

module.exports = {
   createProduct,
   getAllProducts,
   getSingleProduct,
   updateProduct,
   deleteProduct,
   uploadImage,
  };