const mongo = require('mongodb').MongoClient;
const assert = require('assert');
const uuid = require('uuid-v4');
const GridFS = require('./gridfs');



/**
 * @description Responsável pelo armazanamento e recuperação
 * de entidades do servidor mongodb
 */
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
        this.grid = new GridFS()
        this.grid.defineBucket(this.database,"instances",8192);
        this.mongoClient = null
    }

    /**
     * @description Cria uma instância
     * @param {*} instanceId instância (de uma app) que está fazendo a criação
     * @param {*} body instância da entidade
     * @returns Promisse com {instanceId : instanceId, timestamp : ts} se sucesso
     */
    create(instanceId, body) {
        return this.save(instanceId, body);
    }

    /**
     * @description Inclui uma nova versão da enitade
     * @param {*} instanceId instância (de uma app) que está fazendo a criação
     * @param {*} body instância com a nova versão da entidade
     * @returns Promisse com {instanceId : instanceId, timestamp : ts} se sucesso
     */
    commit(instanceId, body) {
        return this.save(instanceId, body);
    }

    /**
     * @description Recupera a versão mais recente da entidade
     * @param {*} instanceId  instância (de uma app) que recuperando a
     * versão de uma entidade
     * @returns Promisse com um conjunto com  instâncias da entidade em uma chave 'data':
     * @example
        [
            {
                "data": {
                    "conta": "456",
                    "nome": "Manoel",
                    "saldo": 620
                }
            }
        ]
     */
    head(instanceId) {
        return this.find(instanceId, -1, 1);
    }

    /**
     * @description Recupera a versão mais antiga da entidade
     * @param {*} instanceId  instância (de uma app) que recuperando a
     * versão de uma entidade
     * @returns Promisse com um conjunto com uma instância da entidade em uma chave 'data':
     * @example
        [
            {
                "data": {
                    "conta": "456",
                    "nome": "Manoel",
                    "saldo": 250
                }
            }
        ]
     */
    first (instanceId) {
        return this.find(instanceId, 1);
    }

    /**
     * @description Recupera a história das versões da entidade
     * @param {*} instanceId  instância (de uma app) que recuperando a
     * versão de uma entidade
     * @param first se definido, somente as 'first' primeiras versões
     * da entidade serão recuperadas
     * @param last se  definido, somente as 'last' últimas versões
     * da entidade serão recuperadas
     *
     * @returns Promisse com falha com valor -1, se first e last estiverem definidos     *
     * @returns Promisse com um conjunto com uma instância da entidade em uma chave 'data':
     */
    history(instanceId, first, last) {
        return this.find(instanceId, first, last);
    }


    /**
     * @description Recupera a história das versões da entidade
     * @param {*} instanceId  instância (de uma app) que recuperando a
     * versão de uma entidade
     * @param first se definido, somente as 'first' primeiras versões
     * da entidade serão recuperadas
     * @param last se  definido, somente as 'last' últimas versões
     * da entidade serão recuperadas
     *
     * @returns Promisse com um conjunto com uma instância da entidade em uma chave 'data':
     * @returns Promisse com falha com valor -1
     */
    find(instanceId, first=-1, last=-1) {
        var self = this;
        var closure = function(resolve,reject,client){
            var db = client.db(self.database);
            var collection_name = "instance_" + instanceId.replace(/-/g, '_');
            var collection = db.collection(collection_name);
            var projection = {'data':1, 'version':1, _id : 0};

            var resultSet = {}
            if (first != -1) {
                resultSet = collection.find().project(projection).limit(parseInt(first)).sort( {timestamp : 1});
                resultSet.toArray((err,docs) => {
                    if (err) {reject(err);}
                    else {
                        var promises = []
                        docs.forEach(doc => {
                            if (doc.version === 2) {
                                promises.push(self.grid.download(doc.data.fileName))
                            }else{
                                promises.push(new Promise(res => res(doc)));
                            }

                        })
                        Promise.all(promises).then(list => {
                            resolve(list);
                        }).catch(reject)
                    }
                });
            }
            else if (last != -1) {
                collection.count()
                    .then((count) => {
                        var skip = count - parseInt(last);
                        resultSet = collection.find().project(projection).skip(skip).sort({timestamp : 1});
                        resultSet.toArray((err,docs) => {
                            if (err) {reject(err);}
                            else {
                                var promises = []
                                docs.forEach(doc => {
                                    if (doc.version === 2) {
                                        promises.push(self.grid.download(doc.data.fileName))
                                    }else{
                                        promises.push(new Promise(res => res(doc)));
                                    }

                                })
                                Promise.all(promises).then(list => {
                                    resolve(list);
                                }).catch(reject)
                                    }
                                });
                    })
                    .catch((e) => {reject(e);});
            }
            else {
                resultSet = collection.find().project(projection).sort( {timestamp : 1});
                resultSet.toArray((err,docs) => {
                    if (err) {reject(err);}
                    else {
                        var promises = []
                        docs.forEach(doc => {
                            if (doc.version === 2) {
                                promises.push(self.grid.download(doc.data.fileName))
                            }else{
                                promises.push(new Promise(res => res(doc)));
                            }

                        })
                        Promise.all(promises).then(list => {
                            resolve(list);
                        }).catch(reject)
                    }
                });
            }
        }
        var promise = new Promise((resolve, reject) => {

            if ( (first != -1) && (last != -1) ) {
                reject(-1);
            }
            if (self.mongoClient === null){
                mongo.connect(this.url,
                    function(err, client) {
                        if (err) {
                            reject(err);
                        }
                        self.mongoClient = client;
                        self.grid.setClient(client);
                        closure(resolve,reject,self.mongoClient);
                    }
                );
            }else{
                closure(resolve,reject,self.mongoClient);
            }

        });
        return promise;
    }

    findDocument(collection, query){
        var self = this;

        var closure = function(resolve, reject, client) {
            var db = client.db(self.database);
            db.collection(collection).find(query).toArray(function(err, result) {
                if (err) reject(err);
                resolve(result)
            });
        }
        return new Promise((resolve,reject)=>{
            if (self.mongoClient === null) {
                mongo.connect(this.url, function(err, client) {
                    if (err) reject(err);
                    self.mongoClient = client;
                    self.grid.setClient(client);
                    closure(resolve,reject,self.mongoClient);
                });
            }else{
                closure(resolve,reject,self.mongoClient);
            }
        })
    }

    updateDocument(collection, query, _document){
        var self = this;

        var closure = function(resolve,reject,client) {
            var db = client.db(self.database);
            db.collection(collection).replaceOne(query, _document, function(err, result) {
                if (err) reject(err);
                resolve(result)
            });
        }

        return new Promise((resolve,reject)=>{
            if (self.mongoClient === null) {
                mongo.connect(this.url, function(err, client) {
                    if (err) reject(err);
                    self.mongoClient = client;
                    self.grid.setClient(client);
                    closure(resolve,reject,self.mongoClient);
                });
            }else{
                closure(resolve,reject,self.mongoClient);
            }

        })
    }
    /**
     * @description Salva um instância de uma entidade
     * @param {*} instanceId instância (de uma app) que está fazendo a inserção
     * @param {*} body instância da entidade
     * @returns Promisse com {instanceId : instanceId, timestamp : ts} se sucesso
     */
    save(instanceId, body) {
        var self = this;

        var closure = function(resolve,reject,client){
            var db = client.db(self.database);
            var collection_name = "instance_" + instanceId.replace(/-/g, '_');
            var collection = db.collection(collection_name);

            var ts = new Date().valueOf();
            var doc = {
                version: 2,
                timestamp : ts,
                data : {
                    fileName: uuid()+".json"
                }
            }
            self.grid.upload(doc.data.fileName,{data:body}).then(()=>{
                collection.insertOne(doc).then((result) => {
                    collection.createIndex({timestamp : 1});
                    resolve({instanceId : instanceId, timestamp : ts});
                }).catch((e) => {reject(e);});
            }).catch(reject)
        }
        var promise = new Promise((resolve, reject) => {
            if (self.mongoClient === null){
                mongo.connect(this.url,
                    function(err, client) {
                        if (err) {
                            reject(err);
                        }
                        self.mongoClient = client;
                        self.grid.setClient(client);
                        closure(resolve,reject,self.mongoClient)
                    }
                );
            }else{
                closure(resolve,reject,self.mongoClient)
            }

        });
        return promise;
    }

    saveDocument(collection_name, doc) {
        var self = this;

        var closure = function(resolve,reject,client){
            var db = client.db(self.database);
            var collection = db.collection(collection_name);

            collection.insertOne(doc).then((result) => {
                resolve(result);
            }).catch((e) => {reject(e);});
        }

        var promise = new Promise((resolve, reject) => {
            if (self.mongoClient === null) {
                mongo.connect(this.url,
                    function(err, client) {
                        if (err) {
                            reject(err);
                        }
                        self.mongoClient = client;
                        self.grid.setClient(client);
                        closure(resolve,reject,self.mongoClient)
                    }
                );
            }else{
                closure(resolve,reject,self.mongoClient)
            }
        });
        return promise;
    }

}

module.exports = Storage;

