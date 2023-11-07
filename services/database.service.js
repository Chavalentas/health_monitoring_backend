const dbConfig = require('../config/database.config.json');
const pg =  require('pg')
const loggerService = require("./logging.service");


const initialize = async function(){
    return new Promise(function(resolve, reject){
        let client = createClient();
        client.connect().then(() => {
            loggerService.logInfo('The database connection was sucessful!');
            client.end();
            resolve();
        }, (error) => {
            loggerService.logError(error.message);
            reject(error);
        })
    })
}

const getUserIds = async function(){
    return new Promise(function(resolve, reject){
        let client = createClient();
        client.connect().then(() => {
            let query = `
            SELECT id FROM ${dbConfig.databaseName}.${dbConfig.schema}.${dbConfig.usersRelationName};
            `;
            client.query(query).then((result) => {
                loggerService.logInfo(`The user ids were successfully retrieved!`);
                client.end();
                resolve(result.rows);
            }, (error) => {
                loggerService.logError(error.message);
                reject(error);
            })
        }, (error) => {
            loggerService.logError(error.message);
            reject(error);
        })
    });
}


const getUserIdsEqualTo = async function(userId){
    return new Promise(function(resolve, reject){
        let client = createClient();
        client.connect().then(() => {
            let query = `
            SELECT id FROM ${dbConfig.databaseName}.${dbConfig.schema}.${dbConfig.usersRelationName} 
            WHERE id = '${userId}';
            `;
            client.query(query).then((result) => {
                loggerService.logInfo(`The user ids equal to the id ${userId} were successfully retrieved!`);
                client.end();
                resolve(result.rows);
            }, (error) => {
                loggerService.logError(error.message);
                reject(error);
            })
        }, (error) => {
            loggerService.logError(error.message);
            reject(error);
        })
    });
}

const getUserNamesEqualTo = async function(username){
    return new Promise(function(resolve, reject){
        let client = createClient();
        client.connect().then(() => {
            let query = `
            SELECT username FROM ${dbConfig.databaseName}.${dbConfig.schema}.${dbConfig.usersRelationName} 
            WHERE username = '${username}';
            `;
            client.query(query).then((result) => {
                loggerService.logInfo(`The usernames equal to the username ${username} were successfully retrieved!`);
                client.end();
                resolve(result.rows);
            }, (error) => {
                loggerService.logError(error.message);
                reject(error);
            })
        }, (error) => {
            loggerService.logError(error.message);
            reject(error);
        })
    });
}

const getUser = async function(userId){
    return new Promise(function(resolve, reject){
        let client = createClient();
        client.connect().then(() => {
            let query = `
            SELECT * FROM ${dbConfig.databaseName}.${dbConfig.schema}.${dbConfig.usersRelationName} 
            where id = '${userId}';
            `;
            client.query(query).then((result) => {
                loggerService.logInfo(`The user with the id ${userId} was successfully retrieved!`);
                client.end();
                resolve(result.rows);
            }, (error) => {
                loggerService.logError(error.message);
                reject(error);
            })
        }, (error) => {
            loggerService.logError(error.message);
            reject(error);
        })
    })
}

const getUserByUserName = async function(userName){
    return new Promise(function(resolve, reject){
        let client = createClient();
        client.connect().then(() => {
            let query = `
            SELECT * FROM ${dbConfig.databaseName}.${dbConfig.schema}.${dbConfig.usersRelationName} 
            where username = '${userName}';
            `;
            client.query(query).then((result) => {
                loggerService.logInfo(`The user with the name ${userName} was successfully retrieved!`);
                client.end();
                resolve(result.rows);
            }, (error) => {
                loggerService.logError(error.message);
                reject(error);
            })
        }, (error) => {
            loggerService.logError(error.message);
            reject(error);
        })
    })
}

const insertUser = async function(user){
    return new Promise(function(resolve, reject){
        let client = createClient();
        client.connect().then(() => {
            let query = `
            INSERT INTO ${dbConfig.databaseName}.${dbConfig.schema}.${dbConfig.usersRelationName} 
            (id, username, password)
            VALUES ('${user.id}', '${user.username}', '${user.password}');
            `;
            client.query(query).then(() => {
                loggerService.logInfo(`The user with the id ${user.id} was successfully inserted!`);
                client.end();
                resolve();
            }, (error) => {
                loggerService.logError(error.message);
                reject(error);
            })
        }, (error) => {
            loggerService.logError(error.message);
            reject(error);
        })
    })
}

const deleteUser = async function(userId){
    return new Promise(function(resolve, reject){
        let client = createClient();
        client.connect().then(() => {
            let query = `
            DELETE FROM ${dbConfig.databaseName}.${dbConfig.schema}.${dbConfig.usersRelationName} 
            WHERE id = '${userId}';
            `;
            client.query(query).then(() => {
                loggerService.logInfo(`The user with the id ${userId} was successfully deleted!`);
                client.end();
                resolve();
            }, (error) => {
                loggerService.logError(error.message);
                reject(error);
            })
        }, (error) => {
            loggerService.logError(error.message);
            reject(error);
        })
    });
}

const updateUser = async function(userId, user){
    return new Promise(function(resolve, reject){
        if (user.id !== userId){
            loggerService.logError('The IDs of users do not match!');
            reject({
                'message' : 'The IDs of entries do not match!'
            });
            return;
        }

        let client = createClient();
        client.connect().then(() => {
            let query = `
            UPDATE ${dbConfig.databaseName}.${dbConfig.schema}.${dbConfig.usersRelationName} 
            SET username = '${user.username}'
            WHERE id = '${userId}';
            `;
            client.query(query).then(() => {
                loggerService.logInfo(`The user with the id ${userId} was successfully updated!`);
                client.end();
                resolve();
            }, (error) => {
                loggerService.logError(error.message);
                reject(error);
            })
        }, (error) => {
            loggerService.logError(error.message);
            reject(error);
        })
    });
}

const updatePassword = async function(userId, password){
    return new Promise(function(resolve, reject){
        let client = createClient();
        client.connect().then(() => {
            let query = `
            UPDATE ${dbConfig.databaseName}.${dbConfig.schema}.${dbConfig.usersRelationName} 
            SET password = '${password}'
            WHERE id = '${userId}';
            `;
            client.query(query).then(() => {
                loggerService.logInfo(`The user with the id ${userId} was successfully updated!`);
                client.end();
                resolve();
            }, (error) => {
                loggerService.logError(error.message);
                reject(error);
            })
        }, (error) => {
            loggerService.logError(error.message);
            reject(error);
        })
    });
}

const getEntryIdsEqualTo = async function(entryId){
    return new Promise(function(resolve, reject){
        let client = createClient();
        client.connect().then(() => {
            let query = `
            SELECT id FROM ${dbConfig.databaseName}.${dbConfig.schema}.${dbConfig.entriesRelationName} 
            WHERE id = '${entryId}';
            `;
            client.query(query).then((result) => {
                loggerService.logInfo(`The entry ids equal to the id ${entryId} were successfully retrieved!`);
                client.end();
                resolve(result.rows);
            }, (error) => {
                loggerService.logError(error.message);
                reject(error);
            })
        }, (error) => {
            loggerService.logError(error.message);
            reject(error);
        })
    });
}

const getEntryIds = async function(){
    return new Promise(function(resolve, reject){
        let client = createClient();
        client.connect().then(() => {
            let query = `
            SELECT id FROM ${dbConfig.databaseName}.${dbConfig.schema}.${dbConfig.entriesRelationName};
            `;
            client.query(query).then((result) => {
                loggerService.logInfo(`The entry ids were successfully retrieved!`);
                client.end();
                resolve(result.rows);
            }, (error) => {
                loggerService.logError(error.message);
                reject(error);
            })
        }, (error) => {
            loggerService.logError(error.message);
            reject(error);
        })
    });
}

const getEntries = async function(userId){
    return new Promise(function(resolve, reject){
        let client = createClient();
        client.connect().then(() => {
            let query = `
            SELECT * FROM ${dbConfig.databaseName}.${dbConfig.schema}.${dbConfig.entriesRelationName} 
            WHERE userid = '${userId}';
            `;
            client.query(query).then((result) => {
                loggerService.logInfo(`The entries for the user with the id ${userId} were successfully retrieved!`);
                client.end();
                resolve(result.rows);
            }, (error) => {
                loggerService.logError(error.message);
                reject(error);
            })
        }, (error) => {
            loggerService.logError(error.message);
            reject(error);
        })
    });
}

const insertEntry = async function(entry){
    return new Promise(function(resolve, reject){
        let client = createClient();
        client.connect().then(() => {
            let query = `
            INSERT INTO ${dbConfig.databaseName}.${dbConfig.schema}.${dbConfig.entriesRelationName} 
            (id, userid, datetime, height, weight, sys, dia)
            VALUES ('${entry.id}', '${entry.userId}', to_timestamp(${entry.dateTime} / 1000.0), ${entry.height}, ${entry.weight}, ${entry.sys}, ${entry.dia});
            `;
            client.query(query).then(() => {
                loggerService.logInfo(`The entry with the id ${entry.id} was successfully inserted!`);
                client.end();
                resolve();
            }, (error) => {
                loggerService.logError(error.message);
                reject(error);
            })
        }, (error) => {
            loggerService.logError(error.message);
            reject(error);
        })
    })
}

const deleteEntry = async function(entryId){
    return new Promise(function(resolve, reject){
        let client = createClient();
        client.connect().then(() => {
            let query = `
            DELETE FROM ${dbConfig.databaseName}.${dbConfig.schema}.${dbConfig.entriesRelationName} 
            WHERE id = '${entryId}';
            `;
            client.query(query).then(() => {
                loggerService.logInfo(`The entry with the id ${entryId} was successfully deleted!`);
                client.end();
                resolve();
            }, (error) => {
                loggerService.logError(error.message);
                reject(error);
            })
        }, (error) => {
            loggerService.logError(error.message);
            reject(error);
        })
    });
}

const deleteEntries = async function(userId){
    return new Promise(function(resolve, reject){
        let client = createClient();
        client.connect().then(() => {
            let query = `
            DELETE FROM ${dbConfig.databaseName}.${dbConfig.schema}.${dbConfig.entriesRelationName} 
            WHERE userid = '${userId}';
            `;
            client.query(query).then(() => {
                loggerService.logInfo(`The entry with the id ${userId} was successfully deleted!`);
                client.end();
                resolve();
            }, (error) => {
                loggerService.logError(error.message);
                reject(error);
            })
        }, (error) => {
            loggerService.logError(error.message);
            reject(error);
        })
    });
}

const updateEntry = async function(entryId, entry){
    return new Promise(function(resolve, reject){
        if (entry.id !== entryId){
            loggerService.logError('The IDs of entries do not match!');
            reject({
                'message' : 'The IDs of entries do not match!'
            });
            return;
        }

        let client = createClient();
        client.connect().then(() => {
            let query = `
            UPDATE ${dbConfig.databaseName}.${dbConfig.schema}.${dbConfig.entriesRelationName} 
            SET userid = '${entry.userId}',
                height = ${entry.height},
                weight = ${entry.weight},
                sys = ${entry.sys},
                dia = ${entry.dia}
            WHERE id = '${entryId}';
            `;
            client.query(query).then(() => {
                loggerService.logInfo(`The entry with the id ${entryId} was successfully updated!`);
                client.end();
                resolve();
            }, (error) => {
                loggerService.logError(error.message);
                reject(error);
            })
        }, (error) => {
            loggerService.logError(error.message);
            reject(error);
        })
    });
}

const createClient = function(){
    const client = new pg.Client({
        host: dbConfig.host,
        port: dbConfig.port,
        database: dbConfig.databaseName,
        user: dbConfig.user,
        password: dbConfig.password,
        ssl: dbConfig.ssl
    });

    return client;
}

module.exports = {
    initialize,
    getUserIds,
    getUserIdsEqualTo,
    getUserNamesEqualTo,
    getUser,
    getUserByUserName,
    insertUser,
    updateUser,
    updatePassword,
    deleteUser,
    getEntryIds,
    getEntryIdsEqualTo,
    getEntries,
    insertEntry,
    updateEntry,
    deleteEntry,
    deleteEntries
}