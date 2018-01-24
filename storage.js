var repo = require("./repository.js");
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


module.exports = {Storage}