var Storage = require('./storage.js');
var restify = require('restify');
var server = restify.createServer();
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());


var sto = new Storage({mongoip: "localhost", database : "process_memory"});


/**
 * @description Salva qualquer entidade que esviver no 'body'
 * @returns 200 se OK, 500 se erro
 */
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
            console.log("Erro no 'create':",err);
            res.send(500);
        });
});

/**
 * @description Salva uma nova versão, ou atualização, 
 * de uma entidade que estiver no 'body'
 * @returns 200 se OK, 500 se erro
 */
server.post('/:instanceId/commit', (req, res, next)=>{
    var instanceId = req.params.instanceId;
    data = {}
    if(req.body){
        data = req.body;
    }

    sto.commit(instanceId, data).
        then((result) => {
            res.send(200);
        }).
        catch((err) => {
            console.log("Erro no 'commit':",err);
            res.send(500);
        });    
});

/**
 * @description Recupera a mais recente versão de uma entidade
 * @return Conjunto com  instâncias da entidade em uma chave 'data':
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
server.get('/:instanceId/head', (req, res, next)=>{
    var instanceId = req.params.instanceId;
    sto.head(instanceId).
        then((result) => {
            res.send(result);
        }).
        catch((err) => {
            console.log("Erro no 'head':",err);
            res.send(500);
        });      
});

/**
 * @description Recupera as versões de uma entidade
 * Se exitir um filtro 'first', serão recuperadas as 'first' primeiras 
 * versões da entidade
 * Se exitir um filtro 'last', serão recuperadas as 'last' últimas
 * versões da entidade
 * Se não exitir qualquer filtro, serão recuperadas todas as versões
 * da entidade
 * 
 * @returns Se 'first' e 'last' estiverem definidos, será retornado 400
 * @returns Conjunto com uma instância da entidade em uma chave 'data':     
 * @example
        [
            {
                "data": {
                    "conta": "456",
                    "nome": "Manoel",
                    "saldo": 250
                }
            },
            {
                "data": {
                    "conta": "456",
                    "nome": "Manoel",
                    "saldo": 255
                }
            },
            {
                "data": {
                    "conta": "456",
                    "nome": "Manoel",
                    "saldo": 300
                }
            },
            {
                "data": {
                    "conta": "456",
                    "nome": "Manoel",
                    "saldo": 580
                }
            },
            {
                "data": {
                    "conta": "456",
                    "nome": "Manoel",
                    "saldo": 650
                }
            },
            {
                "data": {
                    "conta": "456",
                    "nome": "Manoel",
                    "saldo": 620
                }
            }
        ]
 */
server.get('/:instanceId/history', (req, res, next)=>{
    var instanceId = req.params.instanceId;
    var first = req.query.first;
    var last = req.query.last;

    sto.history(instanceId, first, last).
        then((result) => {
            res.send(result);
        }).
        catch((err) => {
            console.log("Erro no 'history':",err);
            if (err == -1) {
                res.send(400);
            }
            else {
                res.send(500);
            }
        }); 
});

/**
 * @description Recupera a primeira versão da entidade
 * @returns Conjunto com uma instância da entidade em uma chave 'data':
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
server.get('/:instanceId/first', (req, res, next)=>{
    var instanceId = req.params.instanceId;
    sto.first(instanceId).
        then((result) => {
            res.send(result);
        }).
        catch((err) => {
            console.log("Erro no 'first':",err);
            res.send(500);
        });   
});

var port = process.env.PORT || 9091;
server.listen(port, function() {
    console.log('%s listening at %s', server.name, server.url);
});
