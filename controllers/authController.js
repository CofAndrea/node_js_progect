const User = require('../models/Utente');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { attachCookiesToResponse, createTokenUser } = require('../utils');

//registra utente

const register = async (req, res) => {
    const { email, name, password } = req.body;
  
    const emailAlreadyExists = await User.findOne({ email });
    if (emailAlreadyExists) {
      throw new CustomError.BadRequestError('Email già usata');
    }
    //il primo utente registrato è admin
    const isFirstAccount = (await User.countDocuments({})) === 0;
    const role = isFirstAccount ? 'admin' : 'user';

    const user = await User.create({ name, email, password, role });
    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({ res, user: tokenUser });
    res.status(StatusCodes.CREATED).json({ user: tokenUser });
    };

    //login utente

const login = async (req,res) => {
    const { email, password } = req.body
    if(!email || !password){
        throw new CustomError.BadRequestError('Inserire email e password')
    }
    const user = await User.findOne({email})
    if(!user){
        throw new CustomError.UnauthenticatedError('Credenziali non valide')
    }
    const isPasswordCorrect = await user.comparePassword(password)
    if(!isPasswordCorrect){
        throw new CustomError.UnauthenticatedError('Credenziali non valide')
    }
    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({ res, user: tokenUser });
  
    res.status(StatusCodes.OK).json({ user: tokenUser });
}

    //logout utente

const logout = async ( req, res) => {
    res.cookie('token', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now()+1000)
    })
    res.status(StatusCodes.OK).json({msg:'user disconnesso'})
}

module.exports = {
    register,
    login,
    logout,
  };
  