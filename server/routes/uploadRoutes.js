let upload = require('../api/upload');

module.exports = (router) => {

    router.get('/ping', upload.ping);

    return router;
};