// reference:   https://github.com/chris-rock/node-crypto-examples

var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'S1gW@1Passw0rd', // Sig proj specific
	fs = require('fs');

function Crypto(key) {
	if(key != undefined) {
		this.password = key;
	}
}

function encryptstream(stream) {
	var encryptor = crypto.createCipher(algorithm, password);
	return stream.pipe(encryptor);
}

function decryptstream(stream) {
	var decryptor = crypto.createDecipher(algorithm, password);
	return stream.pipe(decryptor);
}

function encrypt(buffer){
	  var cipher = crypto.createCipher(algorithm,password)
		    var crypted = Buffer.concat([cipher.update(buffer),cipher.final()]);
	    return crypted;
}
 
function decrypt(buffer){
	  var decipher = crypto.createDecipher(algorithm,password)
		    var dec = Buffer.concat([decipher.update(buffer) , decipher.final()]);
	    return dec;
}
Crypto.prototype.EncryptStream = encryptstream;
Crypto.prototype.DecryptStream = decryptstream;

Crypto.prototype.Encrypt = encrypt;
Crypto.prototype.Decrypt = decrypt;
module.exports = Crypto;
