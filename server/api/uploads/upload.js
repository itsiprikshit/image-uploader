const Promise = require('bluebird');
const responseFlags = require('../responseFlags');
const constants = require('../constants');
const utils = require('../utils');

/**
 * Read multiple files and upload to s3
 * 
 * @param {Array} files 
 * @returns 
 */
let readMultipleFilesAnduploadToS3 = (files) => {
	// return new Promise((resolve, reject) => {

	return Promise.coroutine(function* () {

		let result = [];
		files.forEach((file) => {
			result.push(yield utils.readFileAndUploadToS3(file));
		});

		return result;
	})().then((response) => {
		return result;
	}).catch((err) => {
		throw err;
	})



	// let parallelTasks = [];

	// files.forEach((file) => {
	// 	parallelTasks.push(utils.readFileAndUploadToS3.bind(null, file));
	// });

	// return Promise.all(parallelTasks.map((task) => { return task(); })).then((result) => {
	// 	return resolve(result);
	// }, (err) => {
	// 	return reject(err);
	// })
	// })
}

let readMultipleFilesAnduploadToS3 = function * (files) {
	let result = [];
	files.forEach((file) => {
		result.push(yield utils.readFileAndUploadToS3(file));
	});

	return result;

}
/**
 * Function to handle the file uploads
 * 
 * @param {Object} req 
 * @param {Object} res 
 */
let uploadImages = (req, res) => {
	Promise.coroutine(function* () {
		let responseWrapper = {};
		let response = {};

		let files = req.files;

		if (!files || !files.length) {
			response = {
				flag: responseFlags.ACTION_FAILED,
				message: 'No files to upload.',
				data: responseWrapper
			};

			return response;
		}

		responseWrapper.files = [];

		if (constants.UPLOAD_TO_S3) {
			let uploadedFiles = yield readMultipleFilesAnduploadToS3(files);
			responseWrapper.files = uploadedFiles.map((file) => {
				return file;
			})
		} else {
			responseWrapper.files = files.map((file) => {
				return file.filename;
			})
		}

		response = {
			flag: responseFlags.ACTION_SUCCESSFUL,
			message: 'Action completed successfully',
			data: responseWrapper
		};

		return response;
	})().catch(function (error) {
		console.error(error.message);
		let response = {
			flag: responseFlags.ACTION_FAILED,
			message: 'Something went wrong. Please try again.'
		};
		return response;
	}).then(function (response) {
		console.log(JSON.stringify(response));
		return res.send(response);
	});
}

exports.uploadImages = uploadImages;