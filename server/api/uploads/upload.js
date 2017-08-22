const Promise = require('bluebird');
const responseFlags = require('../responseFlags');

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

		responseWrapper.files = [];
		
		if (req.files) {
			responseWrapper.files = req.files.map((file) => {
				return file.path;
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