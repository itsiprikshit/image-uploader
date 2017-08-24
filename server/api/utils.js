const aws = require('aws-sdk');
const fs = require('fs');
const constants = require('./constants');

let awsCredentials = constants.AWS_CREDENTIALS;
aws.config.update(awsCredentials);

/**
 * Function to upload data to S3
 * 
 * @param {String} bucketName 
 * @param {String} filename 
 * @param {String} data 
 * @returns 
 */
let uploadToS3 = (bucketName, filename, data) => {
    return new Promise((resolve, reject) => {
        let s3 = new aws.S3();
        let params = {
            ACL: 'private',
            Bucket: bucketName,
            Key: filename,
            Body: data
        };

        s3.upload(params, (uploadError, response) => {
            if (uploadError) {
                return reject(uploadError);
            }
            return resolve(null, response.Location);
        });
    })
};

/**
 * Function that reads a file and uploads it.
 * 
 * @param {Object} file 
 * @returns 
 */
let readFileAndUploadToS3 = (file) => {
    return new Promise((resolve, reject) => {
        fs.readFile(file.path, 'utf8', function (err, data) {
            if (err) {
                return reject(err);
            }

            data = data.toString();
            uploadToS3(constants.IMAGES_UPLOAD_BUCKET_NAME, file.filename, data).then((result) => {
                fs.unlink(file.path, ()=>{});                
                return resolve(result);
            }, (err) => {
                return reject(err);
            });
        });
    })
}

exports.readFileAndUploadToS3 = readFileAndUploadToS3;
exports.uploadToS3 = uploadToS3