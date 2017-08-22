const multer = require('multer');
const Promise = require('bluebird');
const responseFlags = require('../responseFlags');

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname + '/../../uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname)
    }
})

let uploadMulter = multer({ storage: storage });

let uploadMultipart = (fieldname, imageCount) => {
    let upload = uploadMulter.array(fieldname, imageCount);

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