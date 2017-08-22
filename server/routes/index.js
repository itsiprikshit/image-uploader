const uploadRoutes = require('./uploadRoutes');

module.exports = (app, router) => {

    app.use('/upload', uploadRoutes(router));
    
    router.get('*', (req, res) => {
        res.render('../../client/index.html');
    })

};