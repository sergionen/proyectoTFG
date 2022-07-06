const express = require('express');
const validator = require('../validations/userValidations');
const { isAuthenticated, redirectDocuments } = require('../middlewares/authentication');
const logInController = require('../controllers/logInController');
const signUpController = require('../controllers/signUpController');
const documentsController = require('../controllers/documentsController')
const usersController = require('../controllers/usersController')
const router = express.Router();

//Routes for signUpController
router.post('/signup', validator.signUpValidationRules(), signUpController.signUp);
router.get('/signup', redirectDocuments, signUpController.singUpHome);

//Routes for logInController
router.get('/', redirectDocuments, logInController.logInHome);
router.get('/login', redirectDocuments, logInController.logInHome);
router.post('/login', validator.logInValidationRules(), logInController.logIn);
router.post('/logout', isAuthenticated, logInController.logout);

//Routes for users
router.post('/user/delete', isAuthenticated, usersController.deleteAccount);

//Routes for documents
router.get('/documents', isAuthenticated, documentsController.visulizeDocuments);
router.get('/documents/order/:filter', isAuthenticated, documentsController.visulizeFilteredDocuments);
router.get('/document/upload', isAuthenticated, documentsController.uploadDocumentHome);
router.post('/document/upload', isAuthenticated, documentsController.uploadDocument);
router.post('/document/:document_id/delete', isAuthenticated, documentsController.deleteDocument);
router.post('/document/download', isAuthenticated, documentsController.downloadDocument);

module.exports = router;
