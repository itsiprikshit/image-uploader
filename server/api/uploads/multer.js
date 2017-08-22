const multer = require('multer');
const Promise = require('bluebird');
const responseFlags = require('../responseFlags');
const constants = require('../constants');

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname + '/../../uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname)
    }
})

let uploadMulter = multer({
    storage: storage,
    limits: {
        fileSize: constants.MAXIMUM_UPLOAD_FILE_SIZE
    },
    fileFilter: (req, file, callback) => {
        if (constants.ACCEPTED_IMAGE_TYPES.indexOf(file.mimetype) < 0) {
            let err = new Error('Image type not acceptable.')
            return callback(err, false)
        }
        callback(null, true);
    }
});

/**
 * Function to set the multer field name and the number of images being uploaded
 * 
 * @param {String} fieldname 
 * @param {Integer} imageCount 
 * @returns a function
 */
let uploadMultipart = (fieldname, imageCount) => {
    let upload = uploadMulter.array('images', imageCount);

    return (req, res, next) => {

        Promise.coroutine(function* () {

            yield new Promise((resolve, reject) => {
                upload(req, res, (err) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve();
                })
            });

            return;
        })().then(function () {
            next();
        }).catch(function (error) {
            console.error(error.message);
            let response = {
                flag: responseFlags.ACTION_FAILED,
                message: 'Something went wrong. Please try again.'
            };

            return res.send(response);
        });
    }
}

exports.uploadMultipart = uploadMultipart;