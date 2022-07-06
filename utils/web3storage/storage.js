const web3Storage = require('web3.storage');
const fs = require('fs');
const pth = require('path');
const arrayBufferToBuffer = require('arraybuffer-to-buffer');
const { writeMap, readHashfile } = require('../rinkeby/interaction');
const { calculateHash, encryptFile, decryptFile } = require('../encryption/encryption');
require("dotenv").config({ path: '../../.env' });
const storage = new web3Storage.Web3Storage({ token: process.env.WEB3_STORAGE });

//Upload file to IPFS, generate hash and save that hash in Blockchain.
const uploadFile = async (file) => {
    //let content = fs.readFileSync(path);
    console.log("Content: " + file.data);
    let encrypted = encryptFile(file.data);
    console.log("Encrypted: " + encrypted);
    let path = __dirname + '\\filesToUpload\\' + file.name;
    console.log("Path: " + path);
    fs.writeFileSync(path, encrypted);
    let hashFile = calculateHash(file.data);
    let status = await writeMap(hashFile);
    if (status) {
        const cid = await uploadToIPFS(path);
        fs.unlinkSync(path);
        return cid;
    } else
        return { err: "No se ha podido subir el hash del archivo a la red Blockchain debido a problemas de congestión. Vuelva a intentarlo más adelante."}
}

//Upload file to IPFS through Web3Storage.
const uploadToIPFS = async (path) => {
        let files = await web3Storage.getFilesFromPath(path);
        let cid = await storage.put(files);
        return cid;
}

const retrieveFile = async (cid) => {
    const res = await storage.get(cid);
    const files = await res.files();
    console.log(files);
    for (const file of files) {
        let path = __dirname + '\\filesRetrieved\\' + file.name;
        let array_buff = await file.arrayBuffer();
        var buff = arrayBufferToBuffer(array_buff);
        let content = decryptFile(buff);
        console.log('content: ' + content);
        
        //Check integrity.
        let hashFile = calculateHash(content);
        let hash = await readHashfile(hashFile);
        if(hash == '')
            return { err: "El archivo ha sido alterado de alguna manera y no es el mismo que el orginial." };

        fs.writeFile(path, content, (err) => {if(err) { console.log("shite"); throw err; }});
        console.log(`${file.cid} | ${file.name} | ${file.size}`);
        return path;
    }
}

/*const main = () => {
    //uploadFile('Hello.txt', 'output.txt');
    retrieveFile('bafybeifhqctpp52b3e6xlvqr2zbv66uugrk77vxrew4acqgfx4nnnnwgt4');
}
main(); */

module.exports = {
    uploadFile,
    retrieveFile
}
