var fs = require("fs");
var utils = require("./utils.js");
var repositoryMod = require("./repository.js");
function Database(name){
    this._name = name;
    this.INDEX = {};
    this.SEARCH = {
        transactions:{}
    };
}
Database.prototype.save = function(entity, branch, author, message){
    var repo = null;
    if (utils.notExist(author)){
        author = "database-service";
    }
    if (utils.notExist(message)){
        message = "save"
    }
    if (utils.notExist(this.INDEX[entity._document._type])){
        this.INDEX[entity._document._type] = {};
    }
    if (utils.notExist(this.INDEX[entity._document._type][entity._document.id])){
        repo = new repositoryMod.Repository(entity._document._type+"-"+entity._document.id)
        this.INDEX[entity._document._type][entity._document.id] = repo;
    }else{
        repo = this.INDEX[entity._document._type][entity._document.id];
    }
    var branches = repo.current_branches();
    if (branches.find((s)=>s === branch) === undefined){
        branches.push(branch);
    }
    branches.forEach((b)=>{
        this.save_entity(entity,b,author,message);
    });
    
};
Database.prototype.save_entity = function(entity, branch, author, message){
    var repo = null;
    if (utils.notExist(author)){
        author = "database-service";
    }
    if (utils.notExist(message)){
        message = "save"
    }
    if (utils.notExist(this.INDEX[entity._document._type])){
        this.INDEX[entity._document._type] = {};
    }
    if (utils.notExist(this.INDEX[entity._document._type][entity._document.id])){
        repo = new repositoryMod.Repository(entity._document._type+"-"+entity._document.id)
        this.INDEX[entity._document._type][entity._document.id] = repo;
    }else{
        repo = this.INDEX[entity._document._type][entity._document.id];
    }
    if (utils.exist(branch)){
        repo.checkout(branch);
    }
    var head = repo.head();
    
    var hash = repo.commit(entity,message,author,branch);
    if(utils.exist(entity._transaction)){
        if (utils.notExist(this.SEARCH["transactions"][entity._transaction.id])){
            this.SEARCH["transactions"][entity._transaction.id] = [];
        }
        this.SEARCH["transactions"][entity._transaction.id].push({
            type:entity._document._type,
            branch:entity.branch,
            hash:hash
        });
    }
    this.sync();

    return entity;
};

Database.prototype.find_all = function(type){
    var reg = this.INDEX[type];
    var list = [];
    for(var id in reg){
        list.push(reg[id].head().data()._document);
    }
    return list;

};

Database.prototype.commits_by_transaction_id = function(id){
    var result = [];
    if(utils.exist(this.SEARCH["transactions"][id])){
        var list = this.SEARCH["transactions"][id];
        for(var i in list){
            var entities = this.INDEX[list[i].type];
            for(var j in entities){
                var c = entities[j].commit_by_hash(list[i].hash);
                if(utils.exist(c)){
                    result.push(c);
                }                
            }
        }
    }
    return result;
};


Database.prototype.fork = function(type,id,version,origin,branch){
    var commits = this.INDEX[type][id].commits_by_branch(origin);
    var commit = null;
    for (var i in commits){
        commit = commits[i];
        if (commit._data._document._version === version){
            break;
        }
    }
    if (commit !== null){
       //se o commit onde da quebra ou posterior é uma transacao
       //então deve-se replicar o fork em todas as entidades atingidas pela
       //transacao
       var hash = this.INDEX[type][id].fork(commit._hash,branch);
       var newCommits = this.INDEX[type][id].commits_by_branch(branch);
       newCommits.forEach((c)=>{
        commit = utils.clone(c);
        commit._data._branch = branch;
        this.INDEX[type][id].override(commit._hash,commit._data,commit._message,commit._author);
       });
                
       this.INDEX[type][id].checkout(branch);
       return this.INDEX[type][id].commit_by_hash(hash).data();
    }
};

Database.prototype.sync = function(){
    fs.writeFileSync(this._name, JSON.stringify(this));
};

Database.prototype.get_by_id = function(type,id){
    if(utils.exist(this.INDEX[type]) && utils.exist(this.INDEX[type][id])){        
        return this.INDEX[type][id].head().data()._document;
    }
};

Database.prototype.history = function(type, id){
    return repositoryMod.castDataHistory(utils.clone(this.INDEX[type][id]));
}

function clearDatabase (name){
    if (fs.existsSync(name)) {
        fs.unlinkSync(name);
    }
}

function loadDabase (name){
    if (fs.existsSync(name)) {
        var data = fs.readFileSync(name, 'UTF-8');
        var obj = JSON.parse(data);
        var r = utils.castTo(Database,obj);
        for(var collection in r.INDEX){
            for (var entity in r.INDEX[collection]){
                var a = repositoryMod.castRepository(r.INDEX[collection][entity]);
                r.INDEX[collection][entity] = a;
            }
        }
        return r;
    }
    return undefined;
};

module.exports = {
    Database: Database,
    loadDabase: loadDabase,
    clearDatabase: clearDatabase
}

