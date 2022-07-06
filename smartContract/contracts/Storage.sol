// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

/**
 *
 */
contract Storage {
    //Key -> file hash, value -> Cid
    mapping(string => string) private hashSet;

    //Se introduce el hash del archivo con su ubicación en ipfs. 
    function setMap(string calldata hashFile) public {
        hashSet[hashFile] = hashFile;        
    }

    //Si devuelve nada, entonces el hash del archivo no está o ha sido modificado.
    function existsHashFile(string calldata hashFile) public view returns(string memory) {
        return hashSet[hashFile];
    }
}