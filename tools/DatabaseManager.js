const {MongoClient} = require('mongodb')
const co = require('co')
// const assert = require('assert')

function DatabaseManager(options){
    this.url = typeof options.url !== 'undefined' ? options.url : ''
    let me = this

    co(function*(){
        me.db = yield MongoClient.connect(me.url)
        if(typeof me.db === 'undefined'){
            throw new Error('Unable to connect to database')
        }
    })
    .catch((error) => {
        console.error(error)
    })
}

DatabaseManager.prototype.getDatabase = function (){
    return this.db
}

DatabaseManager.prototype.getCollection = function (collectionName){
    return this.db.collection(collectionName)
}

DatabaseManager.prototype.closeDatabase = function(){
    this.db.close()
}

module.exports = DatabaseManager