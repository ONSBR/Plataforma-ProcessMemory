var mongo = require('mongodb');
const BufferStream = require('./bufferStream');


module.exports = function(){
    var self = this;

    self.setClient = (client) => {
        self.client = client;
    };

    self.defineBucket = (database, name, chunkSize) => {
        self.bucketName = name;
        self.database = database;
        self.chunkSize = chunkSize;
    };

    self.upload = (fileName,file) => {
        return new Promise((resolve,reject)=>{
            var bucket = new mongo.GridFSBucket(self.client.db(self.database), {
                chunkSizeBytes: self.chunkSize,
                bucketName: self.bucketName
            });
            var w = bucket.openUploadStream(fileName,{
                contentType:"application/json"
            })
            w.once('finish',resolve)
            w.on('error',reject)
            w.write(Buffer.from(JSON.stringify(file)))
            w.end()
        });
    };

    self.download = (fileName) => {
        return new Promise((resolve,reject)=>{
            var stream = new BufferStream()
            var bucket = new mongo.GridFSBucket(self.client.db(self.database), {
                chunkSizeBytes: self.chunkSize,
                bucketName: self.bucketName
            });
            bucket.openDownloadStreamByName(fileName).pipe(stream).on('finish',()=>{
                resolve(stream.toJSON())
            }).on('error',reject);
        })
    };
    return self;
};