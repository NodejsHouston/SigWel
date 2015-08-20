// Part of https://github.com/chris-rock/node-crypto-examples

var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'S1gW@1Passw0rd',
	fs = require('fs');

function Crypto(key) {
	if(key != undefined) {
		this.password = key;
	}
}


function encrypt(stream) {
	var encryptor = crypto.createCipher(algorithm, password);
	return stream.pipe(encryptor);
}

function decrypt(stream) {
	var decryptor = crypto.createDecipher(algorithm, password);
	return stream.pipe(decryptor);
}
Crypto.prototype.Encrypt = encrypt;
Crypto.prototype.Decrypt = decrypt;
module.exports = Crypto;
