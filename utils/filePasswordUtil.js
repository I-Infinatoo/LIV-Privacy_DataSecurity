const crypto = require('crypto');
const fs = require('fs');
const { Module } = require('module');

const algorithm = 'aes-256-cbc';
// const password = 'Password@123';
// const inputFileName = 'keyFile.json';
// const outputFileName = 'encryptedKeyFile.json';

const encrypt = (inputFileName, outputFileName, password, callback) => {
  

    const input = fs.createReadStream(inputFileName);
    console.log('opened inputfile');
    const output = fs.createWriteStream(outputFileName);
    console.log('opened outputfile');

  const key = crypto.createHash('sha256').update(password).digest();
  const cipher = crypto.createCipher(algorithm, key);

  input.pipe(cipher).pipe(output);

  output.on('finish', () => {
    console.log('Encryption complete');
    callback(true);
  });
};

const decrypt = (inputFileName, outputFileName, password) => {
  const input = fs.createReadStream(inputFileName);
  const output = fs.createWriteStream(outputFileName);

  const key = crypto.createHash('sha256').update(password).digest();
  const decipher = crypto.createDecipher(algorithm, key);

  input.pipe(decipher).pipe(output);

  output.on('finish', () => {
    console.log('Decryption complete');
  });
};

module.exports = {
    encrypt,
    decrypt
}
