const Buffer = require('safe-buffer').Buffer;
const Keygrip = require('keygrip');
const keys = require('../../config/keys');
const keygrip = new Keygrip([keys.cookieKey]);

// Mongoose user model
module.exports = (user) => {
    const sessionObject = {
        passport: {
            user: user._id.toString() //TODO; test without toString()
        }
    };
    const session = Buffer.from(JSON.stringify(sessionObject))
        .toString('base64');
    const sig = keygrip.sign('session=' + session); // format just follows the way library does

    return { session, sig };
};