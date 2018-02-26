const mongo = require('mongodb').MongoClient;
const assert = require('assert');
const uuid = require('uuid-v4');

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
    }

    /**
     * @description Cria uma instância
     * @param {*} instanceId instância (de uma app) que está fazendo a criação
     * @param {*} body instância da entidade
     * @returns Promisse com {instanceId : instanceId, timestamp : ts} se sucesso
     */
    create(instanceId, body) {
        console.log(`creating with ${JSON.stringify(body,null,4)}`);
        return this.save(instanceId, body);
    }

    /**
     * @description Inclui uma nova versão da enitade
     * @param {*} instanceId instância (de uma app) que está fazendo a criação
     * @param {*} body instância com a nova versão da entidade
     * @returns Promisse com {instanceId : instanceId, timestamp : ts} se sucesso
     */
    commit(instanceId, body) {
        console.log(`commiting with ${JSON.stringify(body,null,4)}`);
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
        var promise = new Promise((resolve, reject) => {

            if ( (first != -1) && (last != -1) ) {
                reject(-1);
            }
            mongo.connect(this.url,
                function(err, client) {
                    if (err) {
                        reject(err);
                    }

                    var db = client.db(self.database);
                    var collection_name = "instance_" + instanceId.replace(/-/g, '_');
                    var collection = db.collection(collection_name);
                    var projection = {'data':1, _id : 0};

                    var resultSet = {}
                    if (first != -1) {
                        resultSet = collection.find().project(projection).limit(parseInt(first)).sort( {timestamp : 1});
                        resultSet.toArray((err,docs) => {
                            if (err) {reject(err);}
                            else {resolve(docs);}
                        });
                    }
                    else if (last != -1) {
                        collection.count()
                            .then((count) => {
                                var skip = count - parseInt(last);
                                resultSet = collection.find().project(projection).skip(skip).sort({timestamp : 1});
                                resultSet.toArray((err,docs) => {
                                    if (err) {reject(err);}
                                    else {resolve(docs);}
                                });
                            })
                            .catch((e) => {reject(e);});
                    }
                    else {
                        resultSet = collection.find().project(projection).sort( {timestamp : 1});
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


    /**
     * @description Salva um instância de uma entidade
     * @param {*} instanceId instância (de uma app) que está fazendo a inserção
     * @param {*} body instância da entidade
     * @returns Promisse com {instanceId : instanceId, timestamp : ts} se sucesso
     */
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

