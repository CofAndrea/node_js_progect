const express = require('express');
const router = express.Router();
const {
    authenticateUser,
    authorizePermissions,
  } = require('../middleware/autenticazione');

  const {
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword,
    deleteUser
  } = require('../controllers/utenteController');

  router
  .route('/')
  .get(authenticateUser, authorizePermissions('admin'), getAllUsers);

  router.route('/showMe').get(authenticateUser, showCurrentUser)
  router.route('/updateUser').patch(authenticateUser, updateUser);
  router.route('/updateUserPassword').patch(authenticateUser, updateUserPassword);
  
  router.route('/:id').get(authenticateUser, getSingleUser).delete(authenticateUser, deleteUser)

module.exports = router;
