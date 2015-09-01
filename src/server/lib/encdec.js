var crypto = require('crypto');
var encryption_key = "SigWel@Encrypt1onK@Y3333"; //192bits
var iv = "1234aaaa"; //64bits

function Crypto(key) {
	if(key != undefined) {
		this.iv = key;
	}
}
function encrypt(obj){
	var str = JSON.stringify(obj);
	var cipher = crypto.createCipheriv('des-ede3-cbc', encryption_key, iv);
	var ciph = cipher.update(str, 'utf8', 'base64');
	ciph += cipher.final('base64');
	return ciph;
}

function decrypt(obj){
	str = JSON.stringify(obj);
	var decipher = crypto.createDecipheriv('des-ede3-cbc', encryption_key, iv);
	var txt = decipher.update(str, 'base64', 'utf8');
	txt += decipher.final('utf8');
	return JSON.parse(txt);
}

function test(){
	var o1 = ['A', 123, '456']
	var o2 = encrypt(o1);	
	var o3 = decrypt(o2);
	console.log(o1 + " --> " + o2 + " --> " + o3);
}
Crypto.prototype.Encrypt = encrypt;
Crypto.prototype.Decrypt = decrypt;
module.exports = Crypto;
