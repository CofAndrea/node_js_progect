const User = require('../models/Utente');
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors');
const {
    createTokenUser,
    attachCookiesToResponse,
    checkPermissions,
  } = require('../utils');

//ottieni utenti  
  const getAllUsers = async (req, res) => {
    const users = await User.find({role: 'user'}).select('-password')
    res.status(StatusCodes.OK).json({users})
  };

//ottieni utente specifico
 const getSingleUser = async (req, res) => {
  const user = await User.findOne({_id:req.params.id}).select('-password')
  if(!user){
    throw new CustomError.NotFoundError(`Nessun utente con id: ${req.params.id}`)
  }
  checkPermissions(req.user, user._id)
  res.status(StatusCodes.OK).json({user})
 }

//monstra Utente
const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({user})
}

//aggiorna utente
const updateUser = async (req, res) => {
  const {email, name} = req.body
  if(!email || !name){
    throw new CustomError.BadRequestError('Inserire tutti i dati')
  }
  const user = await User.findOne({_id:req.user.userId})
  user.email=email
  user.name=name
  await user.save()

  const tokenUser = createTokenUser(user)
  attachCookiesToResponse({res, user:tokenUser})
  res.status(StatusCodes.OK).json({user:tokenUser})
}

//aggiorna Pwd utente
const updateUserPassword = async (req, res) => {
  const {oldPwd, newPwd} = req.body
  if(!oldPwd || !newPwd){
    throw new CustomError.BadRequestError('Inserire entrambi i dati')
  }
  const user = await User.findOne({_id:req.user.userId})
  const isPwdCorrect = await user.comparePassword(oldPwd)
  if(!isPwdCorrect){
    throw new CustomError.UnauthenticatedError('password non corretta')
  }
  user.password = newPwd
  await user.save()
  res.status(StatusCodes.OK).json({msg: 'Password aggiornata'})
}

//elimina utente
const deleteUser = async (req, res) => {
  const userId = req.params.id;
  const user = await User.findOne({ _id: userId });
  if (!user) {
    throw new CustomError.NotFoundError(`Nessun utente con id: ${userId}`);
  }
  checkPermissions(req.user, user._id);
  await User.deleteOne({ _id: userId });
  res.status(StatusCodes.OK).json({ msg: 'Utente eliminato con successo' });
};


  module.exports = {
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword,
    deleteUser
  };
  