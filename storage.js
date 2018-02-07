const mongo = require('mongodb').MongoClient;
const assert = require('assert');
const uuid = require('uuid-v4');  

class Storage {

    /**
     * 
     * @param {*} config contains 
     * { 
     *     mongodb : "some-ip",
     *     database : "some-database"
     * }
     */
    constructor(config) {
        //this.config = config;
      
        // Connection URL
        this.url = "mongodb://" + config.ip + ":27017";
        this.database = config.database;

  
  
    }

    create(instanceId, body) {
        console.log("instanceId =", instanceId, ", body =", body);
        return this.save(instanceId, body);
    }

    commit(instanceId, body) {
        return this.save(instanceId, body);
    }

    head(instanceId) {
        return this.first_or_last(instanceId, -1);
    }

    first (instanceId) {
        return this.first_or_last(instanceId, 1);
    }

    history(instanceId, first, last) {
        return this.find(instanceId, first, last);
    }

    first_or_last(instanceId, last = 1) {
        console.log("instance =",instanceId);
        var self = this;
        var promise = new Promise((resolve, reject) => { 
            mongo.connect(this.url, 
                function(err, client) {
                    if (err) {
                        reject(err);
                    }
                    var db = client.db(self.database);
                    var collection_name = "instance_" + instanceId.replace(/-/g, '_');    

                    console.log("collection_name =",collection_name);
                    var collection = db.collection(collection_name);

                    collection.find().limit(1).sort( {timestamp : last}).
                        toArray((err,docs) => {
                            if (err) {
                                reject(err);
                            }
                            else {
                                resolve(docs);
                            }                
                        });
                }                
            );
        });
        return promise;
    }



    find(instanceId, first=-1, last=-1) {
        console.log("instance =",instanceId);
        var self = this;
        var promise = new Promise((resolve, reject) => { 
            mongo.connect(this.url, 
                function(err, client) {
                    if (err) {
                        reject(err);
                    }
                    var db = client.db(self.database);
                    var collection_name = "instance_" + instanceId.replace(/-/g, '_');    

                    console.log("collection_name =",collection_name);
                    var collection = db.collection(collection_name);

                    var resultSet = {}
                    if (first != -1) {
                        console.log("first =", first);
                        resultSet = collection.find().limit(parseInt(first)).sort( {timestamp : 1});
                    }
                    else if (last != -1) {
                        console.log("last!");
                        
/*                          collection.count()
                            .then((count) => {
                                var skip = count - parseInt(last);
                                console.log("last =", last, ", count =", count, ", skip=", skip);
                                resultSet = collection.find().skip(skip).sort( {timestamp : 1});      
                            }); */


                        resultSet = collection.find().limit(parseInt(last)).sort( {timestamp : -1});                        
                    }
                    else {
                        resultSet = collection.find().sort({timestamp : 1})
                    }

                    resultSet.toArray((err,docs) => {
                            if (err) {
                                reject(err);
                            } else {
                                //resolve(docs);
                                 if (last != -1) {
                                    var docsAux = [];
                                    var j = 0;
                                    for (var i = docs.length - 1; i != -1; i--) {
                                        docsAux[j] = docs[i];
                                        j++;
                                    }
                                    resolve(docsAux);
                                }
                                else {
                                    resolve(docs);
                                }
                            }
                        }
                    );
                }
            );
        });
        return promise;
    }    

    save(instanceId, body) {
        console.log("instance =",instanceId);
        var self = this;
        var promise = new Promise((resolve, reject) => { 
            mongo.connect(this.url, 
                function(err, client) {
                    if (err) {
                        reject(err);
                    }
                    var db = client.db(self.database);
                    var collection_name = "instance_" + instanceId.replace(/-/g, '_');    

                    console.log("collection_name =",collection_name);
                    var collection = db.collection(collection_name);
                    var ts = new Date().valueOf();
                    var doc = {
                        timestamp : ts,
                        data : body
                    }
                    console.log("doc =", doc);
                    collection.insertOne(doc).then((result) => {
                        collection.createIndex({timestamp : 1});
                        resolve({instanceId : instanceId, timestamp : ts});
                    }).catch((e) => {
                        reject(e);
                    });     
                    //client.close();            
                    //return;
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