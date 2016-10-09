/**
 * Created by tavete on 08/10/16.
 */

var mongo_connection_string = process.env.MONGO_CONNECTION_STRING || 'mongodb://localhost:27016/test-tracker-reports';

module.exports = {
    getProfiles: function() {
        return new Promise(function(fulfill, reject){
            var MongoClient = require('mongodb').MongoClient;
            MongoClient.connect(mongo_connection_string, function(err, db){
                var collection = db.collection('reports');
                collection.distinct('project', function(err, docs){
                    db.close();
                    fulfill(docs);
                })
            })
        });
    },

    getAllFeatures: function(){
        return new Promise(function(fulfill, reject){
            var MongoClient = require('mongodb');
            MongoClient.connect(mongo_connection_string, function(err, db){
                var collection = db.collection('reports');
                collection.find().toArray(function(err, docs){
                    db.close();
                    fulfill(docs);
                })
            })
        })
    }
}