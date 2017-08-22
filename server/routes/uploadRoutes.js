let upload = require('../api/uploads/upload');
let multer = require('../api/uploads/multer');

module.exports = (router) => {

    router.post('/images', multer.uploadMultipart('images', 4), upload.uploadImages);

    return router;
};