/**
 * Function to check server status
 * 
 * @param {Object} req 
 * @param {Object} res 
 * @returns 
 */
let ping = (req, res) => {
    return res.sendStatus(200);
}

exports.ping = ping;