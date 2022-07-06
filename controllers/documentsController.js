const User = require('../models/user');
const Document = require('../models/document');
const storage = require('../utils/web3storage/storage');
const fs = require('fs');

//Get to visulize documents
const visulizeDocuments = (req, res) => {
    let path = '../utils/web3storage/filesRetrieved';
    console.log(path);
    //unlinkSync(path);
    User.findById({_id: req.user._id}, (err, user) => {
        if(err){
            console.log(err);
            return res.status(500).render('500');
        } else {
            Document.find({user: user._id}, (err, docs) => {
                if(err) {
                    console.log(err);
                    return res.status(500).render('500');
                }
                console.log(docs);
                console.log(user.username);
                docs = orderDocsByName(docs);
                return res.status(200).render('documents', { username: user.username, documents: docs });
            });
        }
    });
}

//Get to visualize filtered documents
const visulizeFilteredDocuments = (req, res) => {
    User.findById({_id: req.user._id}, (err, user) => {
        if(err){
            console.log(err);
            return res.status(500).render('500');
        } else {
            Document.find({user: user._id}, (err, docs) => {
                if(err) {
                    console.log(err);
                    return res.status(500).render('500');
                }
                console.log(req.params.filter);
                console.log(user.username);
                console.log("Docs1:");
                console.log(docs);
                switch(req.params.filter) {
                    case "alphabeticDesc":
                        console.log("alphabeticDesc");
                        docs = orderDocsByName(docs);
                        break;
                    case "alphabeticAsc":
                        console.log("alphabeticDesc");
                        docs = orderDocsByName(docs).reverse();
                        break;
                    case "extension":
                        console.log("extension");
                        docs = orderDocsByExtension(docs);
                        break;
                }
                console.log("Docs2:");
                console.log(docs);
                return res.status(200).render('documents', { username: user.username, documents: docs });
            });
        }
    });
}

//Get to upload document
const uploadDocumentHome = (req, res) => {
    return res.status(200).render('uploadDocument', { username: req.user.username });
}

//Upload the document
const uploadDocument = async (req, res) => {
    if (!req.files) {
        console.log('Error al cargar el archivo');
        return res.status(409).render('uploadDocument', {
            username: req.user.username, 
            error: "Error al subir el archivo. Vuelva a intentarlo."});
    }
    
    const uploadedFile = req.files.fileToUpload;
    console.log(req.files.fileToUpload);

    //Create the document
    const name = uploadedFile.name;
    const extension = getExtension(name);
    const CID = await storage.uploadFile(uploadedFile);
    console.log('CID: ' + CID);

    if(CID.err)
        return res.status(409).render('uploadDocument', {
            username: req.user.username, 
            error: CID.err});            

    const document = new Document({ name: name, extension: extension, CID: CID, user: req.user });       
    document.save((err, newDoc) =>  {
        if(err){
            console.log(err);
            return res.status(500).render('500');
        }
        
        const filter = req.user._id;
        const update = { $push: { documents: newDoc } };
 
        //Add the doc to the user
        User.findOneAndUpdate({_id: filter}, update, (err, result) => { 
            if(err) {
                console.log(err);
                return res.status(500).render('500');
            }
            console.log(result);
            return res.redirect('/documents');
        });
    }); 
}

//Delete a document.
const deleteDocument = (req, res) => {
    //Delete doc.
    const doc_id = req.params.document_id;
    console.log(doc_id);
    Document.findByIdAndDelete(doc_id, (err, result) => {
        if (err){
            console.log(err);
            return res.status(500).render('500');
        } else {
            console.log("Deleted : ", result);
            
            //Delete the reference in the user
            const filter = req.user._id;
            const update = { $pull: { documents: doc_id } }
            User.findOneAndUpdate({_id: filter}, update, (err, result) => {
                if(err){
                    console.log(err);
                    return res.status(500).render('500');
                }
                else {
                    console.log(result);
                    return res.redirect('/documents');
                }
            });
        }
    });
};

const downloadDocument = (req, res) => {
    console.log(req.body);
    console.log("Document_id: " + req.body.document_id);
    Document.findById({_id: req.body.document_id}, async (err, doc) => {
        if (err)
            return res.status(500).render('500');
        console.log("sigue: ");
        let path = await storage.retrieveFile(doc.CID);

        if (path.err)
            res.json({succes: "false"});
        
        console.log("path in controller: " + path);
        res.download(path);
        //unlinkSync(path);
    });
}

//private methods

const orderDocsByExtension = (docs) => {
    return docs.sort(((a, b) => {
        if (a.extension.toLowerCase() == b.extension.toLowerCase()) {
          return 0;
        }
        if (a.extension.toLowerCase() < b.extension.toLowerCase()) {
          return -1;
        }
        return 1;
      }));
}

const orderDocsByName = (docs) => {
    return docs.sort((a, b) => {
        if (a.name.toLowerCase() == b.name.toLowerCase() ) {
          return 0;
        }
        if (a.name.toLowerCase() < b.name.toLowerCase() ) {
          return -1;
        }
        return 1;
      });
}

const getExtension = (uploadedFileName) => {
    switch(uploadedFileName.substring(uploadedFileName.length - 3)){
        case "txt":
            return "plain_file.svg";
        case "jpg":
            return "img_file.svg";
        case "png":
            return "img_file.svg";
        case "doc":
            return "word_file.svg";
        case "rar":
            return "zip_file.svg";
        case "zip":
            return "zip_file.svg";
        case "pdf":
            return "pdf_file.svg";
        default:
            return "unknown_extension"
    }   
};

module.exports = {
    visulizeDocuments,
    visulizeFilteredDocuments,
    uploadDocumentHome,
    uploadDocument,
    deleteDocument,
    downloadDocument
}