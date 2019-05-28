
function log(req, res, next) {
    console.log('Custom Middleware Logic Block.');
    next();
}

module.exports = log;
