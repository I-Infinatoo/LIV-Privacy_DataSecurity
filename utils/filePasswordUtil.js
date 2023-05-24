const crypto = require('crypto');
const fs = require('fs');

function protectWithPassword(filePath, password, callback) {

    // console.log('Protect pass: ' + password);
    
    // Read the contents of the JSON file
    const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Encrypt the JSON data with the password using AES-256-CBC encryption
    const algorithm = 'aes-256-cbc';
    const key = crypto.createHash('sha256').update(password).digest();
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encryptedData = cipher.update(JSON.stringify(jsonData), 'utf8', 'hex');
    encryptedData += cipher.final('hex');
    
    // Write the encrypted data back to the file
    fs.writeFileSync(filePath, JSON.stringify({
        iv: iv.toString('hex'),
        encryptedData
    }));

    callback(true);
}

function removePassword(filePath, password, callback) {
    
    // console.log('remove pass: ' + password);
    // Read the contents of the encrypted JSON file
    const { iv, encryptedData } = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Decrypt the JSON data with the password using AES-256-CBC encryption
    const algorithm = 'aes-256-cbc';
    const key = crypto.createHash('sha256').update(password).digest();
    const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(iv, 'hex'));
    let decryptedData;
    try{

        decryptedData = decipher.update(encryptedData, 'hex', 'utf8');
        decryptedData += decipher.final('utf8');
    } catch (err) {
        if (err.message === 'bad decrypt') {
            // console.log('Invalid password');
            callback(false);
            return;
        }
        throw err;
    }

    decryptedData= '{\n'+decryptedData.substring(1, decryptedData.length-1)+'\n}';
    // console.log('decryptedData: ' + decryptedData);

    // Write the decrypted data back to the file
    fs.writeFileSync(filePath, decryptedData);

    callback(true);
}

function createPassword(email, name) {
    // 4 letters or minimum before '@' from email 
    // 4 letters or minimum from name (starting)

    // ishurajan@gmail.com
    const endIdx = email.indexOf("@");
    const startIdx = Math.max(endIdx-4, 0);

    const firstHalf=email.substring(startIdx, endIdx);
    const secondHalf=name.substring(0, Math.min(name.length, 4));

    return firstHalf+secondHalf;
}

module.exports = {
    protectWithPassword,
    removePassword,
    createPassword
}