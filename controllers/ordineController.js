const Order = require('../models/Ordine');
const Product = require('../models/Prodotto');

const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { checkPermissions } = require('../utils');
//modello random per pagamenti
const fakeStripeAPI = async ({ amount, currency }) => {
    const client_secret = 'someRandomValue';
    return { client_secret, amount };
  };
//modello random per pagamenti

//crea ordine
const createOrder = async (req,res) => {
    const {items:cartItems, tax, shippingFee} = req.body
    console.log(req.body);
    if(!cartItems || cartItems.length < 1){
        throw new CustomError.BadRequestError('carello vuoto')
    }
    if(!tax || !shippingFee){
        throw new CustomError.BadRequestError('dichiarare tasse e spesa di spedizione')
    }
    let orderItems = []
    let subtotal = 0

    for(const item of cartItems){
        const dbProduct = await Product.findOne({_id:item.product})
        if(!dbProduct){
            throw new CustomError.NotFoundError(`Nessun prodotto con id: ${item.product}`)
        }
        const {name, price, image, _id} = dbProduct
        const singleOrderItem = {
            amount: item.amount,
            name,
            price,
            image,
            product: _id
        }
        orderItems = [...orderItems, singleOrderItem]
        subtotal += item.amount * price
    }
    const total = tax + shippingFee + subtotal;
    //modello random per pagamenti
    const paymentIntent = await fakeStripeAPI({
        amount: total,
        currency: 'usd',
      });
    //modello random per pagamenti
    
    const order = await Order.create({
        orderItems,
        total,
        subtotal,
        tax,
        shippingFee,
        clientSecret: paymentIntent.client_secret,
        user: req.user.userId
    })
    res.status(StatusCodes.CREATED).json({order, clientSecret:order.clientSecret})
}

//trova tutti gli ordini
const getAllOrders = async (req, res) => {
    const orders = await Order.find({})
    res.status(StatusCodes.OK).json({orders, count: orders.length})
}

//trova ordine specifico
const getSingleOrder = async (req, res) => {
    const {id:orderId} = req.params
    const order = await Order.findOne({_id: orderId})
    if(!order) {
        throw new CustomError.NotFoundError(`nessun ordine con id: ${orderId}`)
    }
    checkPermissions(req.user, order.user)
    res.status(StatusCodes.OK).json({order})
}

//trova ordine dell'utente loggato
const getCurrentUserOrders = async (req, res) => {
    const orders = await Order.find({user: req.user.userId})
    res.status(StatusCodes.OK).json({orders, count:orders.length})
}

//modifica ordine
const updateOrder = async (req, res) => {
    const {id:orderId} = req.params
    const {paymentIntentId} = req.body
    const order = await Order.findOne({_id: orderId})
    if(!order){
        throw new CustomError.NotFoundError(`nessun ordine con id: ${orderId}`)
    }
    controllaPermessi(req.user, order.user)
    order.paymentIntentId = paymentIntentId
    order.status = 'paid'
    await order.save()
    res.status(StatusCodes.OK).json({order})
}

//cancella ordine
const deleteOrder = async (req, res) => {
    const {id:orderId} = req.params
    const order = await Order.findOneAndRemove({_id: orderId})
    if(!order) {
        throw new CustomError.NotFoundError(`nessun ordine con id: ${orderId}`)
    }
    checkPermissions(req.user, order.user)
    res.status(StatusCodes.OK).json({order, msg:'ordine cancellato'})
}

module.exports = {
    createOrder,
    getAllOrders,
    getSingleOrder,
    getCurrentUserOrders,
    updateOrder,
    deleteOrder
  };