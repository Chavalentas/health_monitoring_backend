const dbService = require("../services/database.service.js");
const hashingService = require("../services/hashing.service.js");
const idGenerator = require("../services/id-generator.service.js");
const userConfig = require('../config/user.config.json');
const jwt = require('jsonwebtoken');
const User = require("../models/user.model");

//POST '/userid'
const verifyRequest = async(req, res) => {
    try
    {
        var token = req.body.token;
        var decodedToken;
        jwt.verify(token, 'secret', function(err, tokendata){
            if(err){
                return response.status(400).json({error: 'Unauthorized request'});
             }

              if(tokendata){
                decodedToken = tokendata;
              }
        })
    
        res.status(200).json({id : decodedToken.id});
    } catch (e){
        res.status(404).json({message : 'Token verification failed!:  ' + e.message});
    }
};

//POST '/login'
const loginRequest = async(req, res) => {
    try
    {
        if (req.body.username === undefined || req.body.username === null || req.body.username === ''){
           throw new Error('The property req.body.username was not defined or was null!');
        }
 
        if (req.body.password === undefined || req.body.password === null || req.body.password === ''){
           throw new Error('The property req.body.password was not defined or was null!');
        }
 
        if (req.body.username.length == 0){
           throw new Error('The username cannot be empty!');
        }

        if (req.body.password.length == 0){
            throw new Error('The password length cannot be empty!');
        }

        var users = await dbService.getUserByUserName(req.body.username);

        if (users.length != 1){
            throw new Error('The length of the users has to be 1!');
        }

        hashingService.isValid(req.body.password, users[0].password).then((valid) => {
            if (valid){         
               var token = jwt.sign({id: users[0].id},'secret', {expiresIn : '3h'});
               res.status(200).json({token: token});
            }
            else{
                res.status(404).json({message : 'Login failed!:  ' + 'Wrong password'});
            }
        })
        .catch((error) => {
            res.status(404).json({message : 'The login operation failed: ' + error.message});
        })
    } catch (e){
        res.status(404).json({message : 'The login operation failed: ' + e.message});
    }
};

// GET '/:id
const getUserInformationRequest = async(req, res) => {
    try{
        if (req.params.id === undefined || req.params.id === null || req.params.id === ''){
            throw new Error('The property req.body.username was not defined or was null!');
        }

        var users = await dbService.getUser(req.params.id);

        if (users.length != 1){
            throw new Error('An invalid amount of users was detected!');
        }

        res.status(200).json(users[0]);
    }
    catch(e){
        res.status(404).json({message: 'The get user information operation failed: ' + e.message});
    }
}


//POST '/register'
const registerRequest = async(req, res) => {
    try
    {    
        if (req.body.username === undefined || req.body.username === null || req.body.username === ''){
            throw new Error('The property req.body.username was not defined or was null!');
        }
  
        if (req.body.password === undefined || req.body.password === null || req.body.password === ''){
            throw new Error('The property req.body.password was not defined or was null!');
        }

        var usersPromise = dbService.getUserByUserName(req.body.username);
        var userIdsPromise = dbService.getUserIds();
        var hashingPromise = hashingService.hash(req.body.password);
        var users = await usersPromise;

        if (users.length > 0){
            throw new Error('The user with the given name already exists!');
        }
 
        var passwordHashed = await hashingPromise;
        var userIds = await userIdsPromise;
        var id = idGenerator.generateId(userConfig.idLength, userIds);
        var testUser = new User(id, req.body.username, passwordHashed);
 
        dbService.insertUser(testUser).then(() => {
          res.status(201).json({message : `User with the id ${id}  was successfully registered!`});
        })
        .catch((error) => {
            res.status(404).json({message : 'The register operation failed: ' + error.message});
        })
    } catch (e){
        res.status(404).json({message : 'The register operation failed: ' + e.message});
    }
};

//DELETE '/:id'
const deleteUserRequest = async(req, res) => {
    try
    {
       if (req.params.id === undefined || req.params.id === null || req.params.id === ''){
         throw new Error('The id of the user was not defined or was null!');
       }

       dbService.deleteUser(req.params.id).then(() => {
        res.status(200).json({message: `The user with id ${req.params.id} was successfully deleted!`});
       }, (error) => {
        res.status(404).json({message : 'The delete operation failed: ' + error.message});
       })
    } catch (e){
        res.status(404).json({message : 'The delete operation failed: ' + e.message});
    }
};


//PUT '/:id'
const updateUserRequest = async(req, res) => {
    try
    {
        if (req.params.id === undefined || req.params.id === null || req.params.id === ''){
            throw new Error('The property req.params.id was not defined or was null!');
       }

        if (req.body.username === undefined || req.body.username === null || req.body.username === ''){
            throw new Error('The property req.body.username was not defined or was null!');
        }
 
        if (req.body.id === undefined || req.body.id === null || req.body.id === ''){
             throw new Error('The property req.body.id was not defined or was null!');
        }
  
        if (req.body.username.length == 0){
            throw new Error('The username cannot be empty!');
        }

        var users = await dbService.getUserByUserName(req.body.username);

        if (users.length > 0){
            throw new Error('The user with the given name already exists!');
        }

        var userToUpdate = new User(req.body.id, req.body.username, '');
 
        dbService.updateUser(req.params.id, userToUpdate).then(() => {
          res.status(200).json({message : `User with id ${req.body.id} was successfully updated!`});
        })
        .catch((error) => {
            res.status(404).json({message : 'The update operation failed: ' + error.message});
        })
    } catch (e){
        res.status(404).json({message : 'The update operation failed: ' + e.message});
    }
};

//PUT '/pw/:id'
const updatePasswordRequest = async(req, res) => {
    try{
        if (req.params.id === undefined || req.params.id === null || req.params.id === ''){
            throw new Error('The property req.params.id was not defined or was null!');
        }

        if (req.body.password === undefined || req.body.password === null || req.body.password === ''){
            throw new Error('The property req.body.password was not defined or was null!');
        }

        let usersPromise = dbService.getUser(req.params.id);
        let passwordPromise = hashingService.hash(req.body.password);
        let users = await usersPromise;

        if (users.length != 1){
            throw new Error('An invalid amount of users was detected!');
        }

        let passwordHashed = await passwordPromise;

        dbService.updatePassword(req.params.id, passwordHashed).then(() => {
            res.status(200).json({message: `The password for the user with the id ${req.params.id} was updated!`});
        })
        .catch((error) => {
            res.status(404).json({message : 'The update password operation failed: ' + error.message});
        })
    }
    catch(e){
        res.status(404).json({message: 'The update password operation failed: ' + e.message});
    }
}

//export controller functions
module.exports = {
    verifyRequest,
    loginRequest, 
    registerRequest,
    deleteUserRequest,
    updateUserRequest,
    updatePasswordRequest,
    getUserInformationRequest
};