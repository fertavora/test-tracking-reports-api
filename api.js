/**
 * Created by tavete on 08/10/16.
 */

var express = require('express');
var bodyParser = require('body-parser');
var logger = require('./logger');
var app = express();
var app_port = 3000;
var expected_credentials = [process.env.USERNAME || 'testreports', process.env.PASSWORD || 'ecrM54ulxN']

var unauthorizedResponse = function(res){
    res.set({
        'WWW-Authenticate': 'Basic realm="Por favor identifíquese"'
    });
    return res.status(401).send();
};

var authenticateCredentials = function(c){
    var auth_string = c.split(' ')[1];
    var decoded = new Buffer(auth_string, 'base64').toString('ascii');
    var credentials = decoded.split(':');
    return (credentials[0] == expected_credentials[0] && credentials[1] == expected_credentials[1]);
};

app.get('/projects', function(req, res){
    logger.info("GET /projects");
    if(req.header('authorization')){
        if(authenticateCredentials(req.header('authorization'))){
            var mongo = require('./MongoHelper');
            mongo.getProfiles().then(function(d){
                res.status(200).send(d);
            });
        }else{
            logger.info('Unauthorized');
            unauthorizedResponse(res);
        }
    }else{
        logger.info('Unauthorized');
        unauthorizedResponse(res);
    }
});

app.get('/features', function(req, res){
    logger.info("GET /features");
    if(req.header('authorization')){
        if(authenticateCredentials(req.header('authorization'))){
            var mongo = require('./MongoHelper');
            mongo.getAllFeatures().then(function(d){
                res.status(200).send(d);
            });
        }else{
            logger.info('Unauthorized');
            unauthorizedResponse(res);
        }
    }else{
        logger.info('Unauthorized');
        unauthorizedResponse(res);
    }
})

logger.info('>>> API STARTED <<<');
var server = app.listen(process.env.PORT || app_port);