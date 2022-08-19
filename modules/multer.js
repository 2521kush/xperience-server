const multer = require('multer');
const multerS3 = require('multer-s3');
const s3 = require('../config/s3');

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'store.woorotest.com',
        key: function(req, file, cb) {
          cb(null, `${Date.now()}_${file.originalname}`)
        }
    }),
    acl: 'public-read-write'
});

module.exports = upload;