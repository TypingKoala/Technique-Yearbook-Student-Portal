// Import cryptr package
const Cryptr = require('cryptr');
// Initialze cryptr instance with the env var 'tnqportalkey' as encryption key
const cryptr = new Cryptr(process.env.tnqportalkey);
// Import secrets file
const secrets = require('../config/secrets.enc.json');

function encrypt(data) {
    return cryptr.encrypt(data);
};

function decrypt(data) {
    return cryptr.decrypt(data);
}

function decryptAppSecret(varName) {
    return cryptr.decrypt(secrets[varName]);
}

// module.exports = cryptr;
module.exports.encrypt = encrypt;
module.exports.decrypt = decrypt;
module.exports.decryptAppSecret = decryptAppSecret;