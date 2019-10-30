var Storage = require('./storage.js');
var restify = require('restify');
var server = restify.createServer();
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());



var sto = new Storage({ mongoip: process.env["MONGO_HOST"] || "localhost", database: "process_memory" });

server.use(function (req, res, next) {
    var parts = req.url.split("/");
    var last = parts.length - 1;
    var action = parts[last].split("?")[0];
    if (req.query.app_origin) {
        console.log(`Request from: ${req.query.app_origin} action: ${action}`);
    } else {
        console.log(`Request from: ${req.url}`);
    }
    return next();
});

server.post('/:instanceId/create', (req, res, next) => {

    var instanceId = req.params.instanceId;
    data = {}
    if (req.body) {
        data = req.body;
    }
    console.log(`creating instance ${instanceId}`);
    sto.create(instanceId, data).
        then((result) => {
            res.send(200);
        }).
        catch((err) => {
            console.log("Erro no 'create':", err);
            res.send(500);
        });
});




server.post('/:instanceId/commit', (req, res, next) => {
    var instanceId = req.params.instanceId;
    data = {}
    if (req.body) {
        data = req.body;
    }
    console.log(`commiting instance ${instanceId}`);
    sto.commit(instanceId, data).
        then((result) => {
            res.send(200);
        }).
        catch((err) => {
            console.log("Erro no 'commit':", err);
            res.send(500, err);
        });
});




server.get('/:instanceId/head', (req, res, next) => {
    var instanceId = req.params.instanceId;
    sto.head(instanceId).
        then((result) => {
            res.send(result.map(r => r.data)[0]);
        }).
        catch((err) => {
            console.log("Erro no 'head':", err);
            res.send(500);
        });
});

server.post('/:from_instance/:to_instance/clone', (req, res, next) => {
    var from_instance = req.params.from_instance;
    var to_instance = req.params.to_instance;
    var first = 2;
    sto.history(from_instance, first)
        .then((result) => {
            to_clone = result.map(r => r.data);
            if (to_clone && to_clone.length > 0) {
                to_clone[0].reproduction = {
                    from: from_instance,
                    to: to_instance
                }
                Object.assign(to_clone[1], to_clone[0]);
                to_clone[1].event.reproduction = to_clone[1].reproduction;
                to_clone[1]['reproduction'] = undefined;
            }
            sto.create(to_instance, to_clone.shift()).then(() => {
                var promises = [];
                to_clone.forEach(item => {
                    promises.push(sto.commit(to_instance, item));
                });
                return Promise.all(promises);
            })
                .then(() => res.send(200))
                .catch(e => res.send(500, error(e)));
        }).catch((err) => {
            console.log("Clone error:", err);
            if (err == -1) {
                res.send([]);
            }
            else {
                res.send(500, err);
            }
        });
});


server.get('/:instanceId/history', (req, res, next) => {
    var instanceId = req.params.instanceId;
    var first = req.query.first;
    var last = req.query.last;

    sto.history(instanceId, first, last).
        then((result) => {
            res.send(result.map(r => r.data));
        }).
        catch((err) => {
            console.log("Erro no 'history':", err);
            if (err == -1) {
                res.send(400);
            }
            else {
                res.send(500);
            }
        });
});


server.get('/:instanceId/first', (req, res, next) => {
    var instanceId = req.params.instanceId;
    sto.first(instanceId).
        then((result) => {
            res.send(result.map(r => r.data));
        }).
        catch((err) => {
            console.log("Erro no 'first':", err);
            res.send(500);
        });
});


server.get('/:instanceId/event', (req, res, next) => {
    var instanceId = req.params.instanceId;
    sto.first(instanceId).
        then((result) => {
            res.send(result.map(r => r.data.event));
        }).
        catch((err) => {
            console.log("Erro no 'first':", err);
            res.send(500);
        });
});


server.post('/:collection', (req, res, next) => {

    var collection_name = req.params.collection;
    data = {}
    if (req.body) {
        data = req.body;
    }
    sto.saveDocument(collection_name, data).
        then((result) => {
            res.send(200, result);
        }).
        catch((err) => {
            console.log("Erro no 'create':", err);
            res.send(500, err.toString());
        });
});

server.get('/instances/byEntities', (req, res, next) => {
    var query = clone(req.query);
    var systemId = query["systemId"]
    var collection_name = ("query_instance_"+systemId).replace("-","_");
    delete query["app_origin"]
    var entities = query["entities"].split(",")

    var queryMongo = {"entities": { $elemMatch: {"name" : { $in:entities } } }}
    var tag = query["tag"]
    if (tag) {
        queryMongo["tag"] = { $ne:tag }
    }
    queryMongo["reprocessable"] = true;
    if (query["instances"]){
        var instances = query["instances"].split(",")
        queryMongo["process"]={$in: instances}
    }
    //var queryMongo = {"entities": { $elemMatch: {"name" : { $in:entities } } }, timestamp: {$gte:timestamp} }
    console.log(queryMongo)
    sto.findDocument(collection_name, queryMongo).
        then((result) => {
            res.send(result);
        }).
        catch((err) => {
            console.log("Erro no 'first':", err);
            res.send(500, err.toString());
        });
});

server.get('/:collection', (req, res, next) => {
    var collection_name = req.params.collection;
    var query = clone(req.query);
    delete query["app_origin"]

    sto.findDocument(collection_name, query || {}).
        then((result) => {
            res.send(result);
        }).
        catch((err) => {
            console.log("Erro no 'first':", err);
            res.send(500, err.toString());
        });
});



server.put('/:collection', (req, res, next) => {
    var collection_name = req.params.collection;
    data = {}
    if (req.body) {
        data = req.body;
    }
    var query = clone(req.query);
    delete query["app_origin"]
    sto.updateDocument(collection_name, query || {}, data).
        then((result) => {
            res.send(result);
        }).
        catch((err) => {
            console.log("Erro no 'first':", err);
            res.send(500, err.toString());
        });
});

function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function error(msg) {
    return { message: msg };
}

var port = process.env.PORT || 9091;
server.listen(port, function () {
    console.log('%s listening at %s', server.name, server.url);
});
