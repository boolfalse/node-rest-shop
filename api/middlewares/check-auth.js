
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

    try {
        // let token = req.body.token;
        let token = req.headers.authorization.split(' ')[1];

        // this method will thrown an error if it'll failed
        // but it also returns decoded token (not encrypted)
        const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY); // , options, callback

        req.user_decoded_token = decoded; // we could extract user's decoded data (from 'req') and use this in further of concrete request

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Auth filed!'
        });
    }

};
