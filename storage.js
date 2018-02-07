const mongo = require('mongodb').MongoClient;
const assert = require('assert');
const uuid = require('uuid-v4');  

class Storage {

    /**
     * 
     * @param {*} config contains 
     * { 
     *     mongoip : "some-ip",
     *     database : "some-database"
     * }
     */
    constructor(config) {
   
        // Connection URL
        this.url = "mongodb://" + config.mongoip + ":27017";
        this.database = config.database;
    }

    create(instanceId, body) {
        return this.save(instanceId, body);
    }

    commit(instanceId, body) {
        return this.save(instanceId, body);
    }

    head(instanceId) {
        return this.find(instanceId, -1, 1);
    }

    first (instanceId) {
        return this.find(instanceId, 1);
    }

    history(instanceId, first, last) {
        return this.find(instanceId, first, last);
    }

    find(instanceId, first=-1, last=-1) {
        var self = this;
        var promise = new Promise((resolve, reject) => { 
            mongo.connect(this.url, 
                function(err, client) {
                    if (err) {
                        reject(err);
                    }

                    var db = client.db(self.database);
                    var collection_name = "instance_" + instanceId.replace(/-/g, '_');    
                    var collection = db.collection(collection_name);

                    var resultSet = {}
                    if (first != -1) {
                        resultSet = collection.find().limit(parseInt(first)).sort( {timestamp : 1});
                        resultSet.toArray((err,docs) => {
                            if (err) {reject(err);} 
                            else {resolve(docs);}
                        });                                 
                    }
                    else if (last != -1) {                      
                        collection.count()
                            .then((count) => {
                                var skip = count - parseInt(last);
                                resultSet = collection.find().skip(skip).sort({timestamp : 1});      
                                resultSet.toArray((err,docs) => {
                                    if (err) {reject(err);} 
                                    else {resolve(docs);}
                                });                                 
                            })
                            .catch((e) => {reject(e);});
                    }
                    else {
                        resultSet = collection.find().sort( {timestamp : 1});
                        resultSet.toArray((err,docs) => {
                            if (err) {reject(err);} 
                            else {resolve(docs);}
                        });                         
                    }
                }
            );
        });
        return promise;
    }    



    save(instanceId, body) {
        var self = this;
        var promise = new Promise((resolve, reject) => { 
            mongo.connect(this.url, 
                function(err, client) {
                    if (err) {
                        reject(err);
                    }
                    
                    var db = client.db(self.database);
                    var collection_name = "instance_" + instanceId.replace(/-/g, '_');    
                    var collection = db.collection(collection_name);

                    var ts = new Date().valueOf();
                    var doc = {
                        timestamp : ts,
                        data : body
                    }

                    collection.insertOne(doc).then((result) => {
                        collection.createIndex({timestamp : 1});
                        resolve({instanceId : instanceId, timestamp : ts});
                    }).catch((e) => {reject(e);});     
                }                
            );
        });
        return promise;
    }

}

module.exports = Storage;













/* var repo = require("./repository.js");
var database = require("./database.js");
var utils = require("./utils.js");


//var
var bd = database.loadDabase("poc.db");
if (bd == undefined) {
    bd = new database.Database("poc.db");
}

function Storage() {
    this.create = function(instanceId, body) {
        var doc = {};
        doc._document = body;
        doc._document._type= instanceId;
        doc._document.id = instanceId;
        bd.save(doc,"master","sistema","dado salvo");
        return doc._document.id;
    };

    this.commit = function(instanceId, body) {
        var doc = {};
        doc._document = body;
        doc._document._type= instanceId;
        doc._document.id = instanceId;
        bd.save(doc,"master","sistema","dado salvo");
        return doc._document.id;
    };

    this.head = function(instanceId) {
        return bd.get_by_id(instanceId, instanceId);
    };

    this.history = function(instanceId) {
        return bd.history(instanceId, instanceId).commits().map(c => {
            var obj = c._data._document;
            obj.timestamp = c._timestamp;
            return obj;
        } );
    };
};


module.exports = {Storage} */