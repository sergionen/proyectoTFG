const crypto = require('crypto');
const fs = require('fs');
require("dotenv").config({path: '../../.env'});

//Calculate hash of the content of a file
const calculateHash = (content) => {
    let hash = crypto.createHash('sha256');
    console.log("Content: " + content);
    let hashFile = hash.update(content).digest('hex');
    console.log('File hash: ' + hashFile);
    return hashFile;
}

//const iv = "5183666c72eec9e4"; // Example
const algorithm = 'aes-256-ctr';
key = crypto.createHash('sha256').update(String(process.env.ENCRYPTION_KEY)).digest('base64').substr(0, 32);

const encryptFile = (buffer) => {
    // Create an initialization vector
    const iv = crypto.randomBytes(16);
    console.log("iv: " + iv.toString('hex'));
    // Create a new cipher using the algorithm, key, and iv
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    // Create the new (encrypted) buffer
    const result = Buffer.concat([iv, cipher.update(buffer), cipher.final()]);
    return result;
};

const decryptFile = (encrypted) => {
   // Get the iv: the first 16 bytes
   const iv = encrypted.slice(0, 16);
   // Get the rest
   encrypted = encrypted.slice(16);
   // Create a decipher
   const decipher = crypto.createDecipheriv(algorithm, key, iv);
   // Actually decrypt it
   const result = Buffer.concat([decipher.update(encrypted), decipher.final()]);
   return result;
};

/*const plain = fs.readFileSync('./Hello.txt');

const encrypted = encryptFile(plain);
console.log('Encrypted:', encrypted.toString());

const decrypted = decryptFile(encrypted);
console.log('Decrypted:', decrypted.toString());
*/

module.exports = {
    calculateHash,
    encryptFile,
    decryptFile
}