const uploadRoutes = require('./uploadRoutes');

module.exports = (app, router) => {

    app.use('/upload', uploadRoutes(router));

};