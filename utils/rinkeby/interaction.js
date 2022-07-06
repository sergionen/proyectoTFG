const Web3 = require('web3');
require("dotenv").config({path: '../../.env'});

const ethNetwork = process.env.RINKEBY_NETWORK;
const address = process.env.ETH_ACCOUNT;
const web3 = new Web3(new Web3.providers.HttpProvider(ethNetwork));
const account = web3.eth.accounts.privateKeyToAccount(process.env.ETH_PK);
web3.eth.accounts.wallet.add(account);
const StorageContract = require('../../smartContract/build/contracts/Storage.json')
const instance = new web3.eth.Contract(StorageContract.abi, StorageContract.networks[4].address);

/**
 * This function communicates with the SmartContract and set the mapping.
 * @param {string} hashFile 
 */
 const writeMap = async (hashFile) => {
    let existingBalance = await web3.eth.getBalance(address)
    console.log("Balance: " + existingBalance);
    let from = web3.eth.accounts.wallet[0].address
    console.log('Tx options:\n\tfrom: ' + from);
    let gas = await instance.methods.setMap(hashFile).estimateGas({ from: from });
    console.log('\tgas: ' + gas);
    let nonce = await web3.eth.getTransactionCount(address);
    console.log('\tnonce: ' + nonce);

    let res = await instance.methods.setMap(hashFile)
                                    .send({ from, gas, nonce });

    console.log("status: " + res.status);
    return res.status; 
}

/**
 * This function communicates with the SmartContract and gets if a hashfile exists.
 * @param {string} hashFile 
 * @returns hash
 */
const readHashfile = async (hashFile) => {
    let hash = await instance.methods.existsHashFile(hashFile).call();
    console.log("HashFile: " + hash);
    return hash; 
}

module.exports = {
    readHashfile,
    writeMap
}
