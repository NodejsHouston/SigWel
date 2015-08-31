var crypto = require('./encdec.js');
var enc = new crypto();
console.log(typeof enc);
var msg = "Hello, SigWel";
var encrypted = enc.Encrypt(msg);
console.log("From: " + msg);
console.log(encrypted);
var decrypted = enc.Decrypt(encrypted);
console.log("Dec: " + decrypted);


var intA1 = new Array();
intA1.push(111);
intA1.push(222);
intA1.push(333);
console.log(intA1);
var encA1 = enc.Encrypt(JSON.stringify(intA1));
console.log(encA1);
var decA1 = JSON.parse(enc.Decrypt(encA1));
console.log(decA1);
