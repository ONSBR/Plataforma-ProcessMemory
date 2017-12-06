function notExist(d){
    return d === null || d === undefined;
}
function exist(d){
    return !notExist(d);
}
function clone(d){
    return JSON.parse(JSON.stringify(d));
}
function print(s) {
    console.log(s);
}
function convertAll(type, collection){
    for(var k in collection){
        collection[k] = castTo(type,collection[k]);
    }
}
function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }
function castTo(baseClass, obj){
    var instance = new baseClass();
    for(var prop in obj){
        instance[prop] = obj[prop];
    }
    return instance;
}

module.exports = {
    notExist: notExist,
    exist: exist,
    clone: clone,
    print: print,
    convertAll: convertAll,
    guid: guid,
    castTo: castTo
}