var Storage = require('./storage.js');
var restify = require('restify');
var server = restify.createServer();
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());


var sto = new Storage({ip: "localhost", database : "test000"});

function format(instanceId) {
    var d = new Date();
    return {
        instanceId: instanceId,
        timestamp: d.getTime()
    };
}

//salva qualquer entidade
server.post('/:instanceId/create', (req, res, next)=>{
    
    var instanceId = req.params.instanceId;
    data = {}
    if(req.body){
        data = req.body;
    }

    sto.create(instanceId, data).
        then((result) => {
            res.send(200);            
        }).
        catch((err) => {
            res.send(500);
        });
});

server.post('/:instanceId/commit', (req, res, next)=>{
    var instanceId = req.params.instanceId;
    data = {}
    if(req.body){
        data = req.body;
    }

    sto.commit(instanceId, data).
        then((result) => {
            res.send(result);
        }).
        catch((err) => {
            res.send(500);
        });    
});

server.get('/:instanceId/head', (req, res, next)=>{
    var instanceId = req.params.instanceId;
    sto.head(instanceId).
        then((result) => {
            if (result.amount == 1) {
                res.send(result.doc);
            }
            else {
                res.send(undefined);
            }
        }).
        catch((err) => {
            res.send(500);
        });      
});

server.get('/:instanceId/history', (req, res, next)=>{
    var instanceId = req.params.instanceId;
    var first = req.query.first;
    var last = req.query.last;
    console.log("instanceId =",instanceId, ", first =", first, ", last =", last);
    sto.history(instanceId, first, last).
        then((result) => {
            if (result.amount == 0) {
                res.send(undefined);                
            }
            else {
                res.send(result.doc);
            }
        }).
        catch((err) => {
            res.send(500);
        }); 

/*     var history = sto.history(instanceId);
    if (first){
       res.send(history.slice(0,first));
    }else if(last){
       res.send(history.slice(history.length - last,history.length)); 
    }else{
       res.send(sto.history(instanceId));
    }
 */
});

server.get('/:instanceId/first', (req, res, next)=>{
    var instanceId = req.params.instanceId;
    sto.first(instanceId).
        then((result) => {
            if (result.amount == 1) {
                res.send(result.doc);
            }
            else {
                res.send(undefined);
            }
        }).
        catch((err) => {
            res.send(500);
        });   
});

var port = process.env.PORT || 9091;
server.listen(port, function() {
    console.log('%s listening at %s', server.name, server.url);
});
