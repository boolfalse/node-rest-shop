
const express = require('express');
const router = express.Router();

const multer = require('multer');
const multer_storage = multer.diskStorage({ // multer will execute 'destination', 'filename' functions, whenever a new file is received
    destination: function (req, file, cb) { // function that defines, where the incoming files should be stored
        cb(null, './uploads'); // args: error, path where you want to store a file
    },
    filename: function (req, file, cb) { // function that defines, how the file should be named
        // cb(null, new Date().toString().replace(/:/g, '-') + '_' + file.originalname); //ss https://stackoverflow.com/questions/48418680/enoent-no-such-file-or-directory/48653921#48653921
        cb(null, (new Date().getTime()/1000|0) + '_' + file.originalname);
    }
});
const multer_limits = {
    fileSize: 1024 * 1024 * 2 // MB
};
const multer_fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true); // false, if need to reject a file and ignore storing. Otherwise: true
    } else {
        // cb(new Error('File format is not valid!'), false);
        cb(null, false);
    }
};
const upload = multer({
    storage: multer_storage,
    limits: multer_limits,
    fileFilter: multer_fileFilter,
});

const ProductController = require('../controllers/product');
const checkAuth = require('../middlewares/check-auth');

router.get('/', ProductController.get_products);
router.get('/:itemId', ProductController.get_product);
router.post('/', checkAuth, upload.single('image'), ProductController.create_product);
router.delete('/:itemId', checkAuth, ProductController.delete_product);
router.patch('/:itemId', checkAuth, ProductController.update_product);

// EXPORTING
module.exports = router;
