var repo = require("./repository.js");
var database = require("./database.js");
var utils = require("./utils.js");


//var 
var bd = database.loadDabase("poc.db");
if (bd == undefined) {
    bd = new database.Database("poc.db");
}

function Storage() {
    this.create = function(appId, body) {       
        var doc = {};
        doc._document = body;
        doc._document._type= appId;
        doc._document.id = utils.guid();
        bd.save(doc,"master","sistema","dado salvo");
        return doc._document.id;
    };

    this.commit = function(appId, instanceId, body) {
        var doc = {};
        doc._document = body;
        doc._document._type= appId;
        doc._document.id = instanceId;
        bd.save(doc,"master","sistema","dado salvo");
        return doc._document.id;        
    };

    this.head = function(appId, instanceId) {        
        return bd.get_by_id(appId, instanceId);
    };

    this.history = function(appId, instanceId) {
        return bd.history(appId, instanceId).commits().map(c => {
            var obj = c._data._document;
            obj.timestamp = c._timestamp;
            return obj;
        } );
    };
};


module.exports = {Storage}