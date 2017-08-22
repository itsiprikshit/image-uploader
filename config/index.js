module.exports = (ENV) => {
    return {
        SERVER      : require('./server')[ENV],
        DB          : require('./db')[ENV],
    }
};
