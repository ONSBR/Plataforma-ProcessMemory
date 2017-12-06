var repo = require("./repository.js");
var database = require("./database.js");
var utils = require("./utils.js");
var bd = new database.Database("teste");

var doc = {
    _transaction: {},
    _command: {},
    _document: {
        _type: "Document",
        id: utils.guid(),
        hello:"World"
    }
}
bd.save(doc,"master","Moneda","teste");
utils.print(bd.find_all("Document"));
doc._document.philippe = "moneda";
bd.save(doc,"master","Moneda","teste");
utils.print("-------------------------------------")
utils.print(bd.find_all("Document"));