const dbService = require("../services/database.service.js");
const entryConfig = require('../config/entry.config.json');
const loggerService = require("../services/logging.service.js");
const idGenerator = require("../services/id-generator.service.js");
const Entry = require("../models/entry.model.js");


//POST '/entriesbyuser'
const getEntriesRequest = async(req, res) => {
    try
    {    
        if (req.body.userId === undefined || req.body.userId === null || req.body.userId === ''){
            throw new Error('The id of the user was not defined or was null!');
        }

        let userIdsPromise = dbService.getUserIdsEqualTo(req.body.userId);
        let entriesPromise = dbService.getEntries(req.body.userId);
        let userIds = await userIdsPromise;

        if (userIds === null || userIds.length === 0){
            throw new Error(`The user with the id ${req.body.userId} does not exist!`);
        }

        if (userIds.length !== 1){
            throw new Error(`Multiple users with the id ${req.body.userId} were found!`);
        }

        let entries = await entriesPromise;
        res.status(200).json(entries);
    } catch (e){
        res.status(404).json({message : 'The get entries operation failed: ' + e.message});
    }
};

//POST '/addentry'
const addEntryRequest = async(req, res) => {
    try
    {  
        if (req.body.userId === undefined || req.body.userId === null || req.body.userId === ''){
            throw new Error('The property req.body.userId was not defined or was null!');
        }

        if (req.body.dateTime === undefined || req.body.dateTime === null || req.body.dateTime === ''){
            throw new Error('The property req.body.dateTime was not defined or was null!');
        }

        if (req.body.height === undefined){
            throw new Error('The property req.body.height was not defined!');
        }

        if (req.body.weight === undefined){
            throw new Error('The property req.body.weight was not defined!');
        }

        if (req.body.sys === undefined){
            throw new Error('The property req.body.sys was not defined!');
        }

        if (req.body.dia === undefined){
            throw new Error('The property req.body.dia was not defined!');
        }

        let userIdsPromise = dbService.getUserIdsEqualTo(req.body.userId);
        let currentIdsPromise = dbService.getEntryIds();
        let userIds = await userIdsPromise;

        if (userIds === null || userIds.length === 0){
            throw new Error(`The user with the id ${req.body.userid} does not exist!`);
        }

        if (userIds.length !== 1){
            throw new Error(`Multiple users with the id ${req.body.userid} were found!`);
        }

        let currentEntryIds = await currentIdsPromise;
        let id = idGenerator.generateId(entryConfig.idLength, currentEntryIds);
        let entryToInsert = new Entry(id, req.body.userId, req.body.dateTime, req.body.height, 
        req.body.weight, req.body.sys, req.body.dia);
        dbService.insertEntry(entryToInsert).then(() => {
            res.status(201).json({id : id});
        }, (error) => {
            res.status(404).json({message : 'The add entry operation failed: ' + error.message});
        })
    } catch (e){
        res.status(404).json({message : 'The add entry operation failed: ' + e.message});
    }
};

//DELETE '/:id'
const deleteEntryRequest = async(req, res) => {
    try
    {
        if (req.params.id === undefined || req.params.id === null || req.params.id === ''){
            throw new Error('The property req.params.id was not defined!');
        }

        dbService.deleteEntry(req.params.id).then(() => {
            res.status(200).json({message: `The deleting of the entry with the id ${req.params.id} was successful!`});
        }, (error) => {
            res.status(404).json({message : 'The delete entry operation failed: ' + error.message});
        })
    } catch (e){
        res.status(404).json({message : 'The delete entry operation failed: ' + e.message});
    }
};

//DELETE '/all/:userId'
const deleteEntriesRequest = async(req, res) => {
    try
    {    
        if (req.params.userId === undefined || req.params.userId === null || req.params.userId === ''){
            throw new Error('The id of the user was not defined or was null!');
        }

        let userIds = await dbService.getUserIdsEqualTo(req.params.userId);

        if (userIds === null || userIds.length === 0){
            throw new Error(`The user with the id ${req.params.userId} does not exist!`);
        }

        if (userIds.length !== 1){
            throw new Error(`Multiple users with the id ${req.params.userId} were found!`);
        }

        dbService.deleteEntries(req.params.userId).then(() => {
            res.status(200).json({message: `The deleting of the entries for the user with the id ${req.params.userId} was successful!`});
        }, (error) => {
            res.status(404).json({message : 'The delete entry operation failed: ' + error.message});
        })
    } catch (e){
        res.status(404).json({message : 'The delete entries operation failed: ' + e.message});
    }
};


//PUT '/:id'
const updateEntryRequest = async(req, res) => {
    try
    {
        if (req.params.id === undefined || req.params.id === null || req.params.id === ''){
            throw new Error('The property req.params.id was not defined or was null!');
        }

        if (req.body.id === undefined || req.body.id === null || req.body.id === ''){
            throw new Error('The property req.body.id was not defined or was null!');
        }

        if (req.body.userId === undefined || req.body.userId === null || req.body.userId === ''){
            throw new Error('The property req.body.userId was not defined or was null!');
        }

        if (req.body.height === undefined){
            throw new Error('The property req.body.height was not defined!');
        }

        if (req.body.weight === undefined){
            throw new Error('The property req.body.weight was not defined!');
        }

        if (req.body.sys === undefined){
            throw new Error('The property req.body.sys was not defined!');
        }

        if (req.body.dia === undefined){
            throw new Error('The property req.body.dia was not defined!');
        }

        let entryToUpdate = new Entry(req.params.id, req.body.userId, req.body.dateTime, req.body.height, 
        req.body.weight, req.body.sys, req.body.dia);
        dbService.updateEntry(req.params.id, entryToUpdate).then(() => {
            res.status(200).json({message: `The entry with the id ${req.params.id} was successfully updated!`});
        }, (error) => {
            res.status(404).json({message : 'The update entry operation failed: ' + error.message});
        })
    } catch (e){
        res.status(404).json({message : 'The update entry operation failed: ' + e.message});
    }
};

//export controller functions
module.exports = {
    addEntryRequest,
    getEntriesRequest, 
    updateEntryRequest,
    deleteEntryRequest,
    deleteEntriesRequest
};