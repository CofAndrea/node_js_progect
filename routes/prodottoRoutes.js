const express = require('express');
const router = express.Router();
const multer = require('multer');
// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

const {
    authenticateUser,
    authorizePermissions,
  } = require('../middleware/autenticazione');
const {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    uploadImage,
} = require('../controllers/prodottoController');




router
.route('/')
.post([authenticateUser, authorizePermissions('admin')], createProduct)
.get(getAllProducts);

router
  .route('/:id/uploadImage')
  .post([authenticateUser, authorizePermissions('admin'), ],upload.single('image'), uploadImage);

router
  .route('/:id')
  .get(getSingleProduct)
  .patch([authenticateUser, authorizePermissions('admin')], updateProduct)
  .delete([authenticateUser, authorizePermissions('admin')], deleteProduct);


module.exports = router;
