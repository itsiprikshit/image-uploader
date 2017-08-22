let serverRoutes = require('./routes');

module.exports = (app, router) => {

    return serverRoutes(app, router);

}