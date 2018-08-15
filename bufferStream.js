var stream = require('stream');
var util = require('util');

function BufferStream () { // step 2
    this.buffer = []
    stream.Writable.call(this);
};
util.inherits(BufferStream, stream.Writable); // step 1

BufferStream.prototype._write = function (chunk, encoding, done) { // step 3
    this.buffer.push(chunk.toString());
    done();
}
BufferStream.prototype.toJSON = function(){
    return JSON.parse(this.buffer.join(""))
}

BufferStream.prototype.toString = function(){
    return this.buffer.join("")
}

module.exports = BufferStream