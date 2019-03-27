'use strict';
var async = require("async");
module.exports = function(Movies) {



    Movies.addDummyTags = function (userData,res, callback) {
        var genericTags = ["fun", "masala","original","hilarious", "tender","sensitive", "action-replay","boring", "ordinary", "static", "silly", "bland","uneven", "slow", "fast moving", "oddball", "wacky", "tired", "trite", "brutal", "moronic", "charismatic", "comical", "imaginative", "legendry", "dazzling", "low-budget","overratted", "impeccable", "slapdash comedy", "suspenseful expose", "poorly executed", "adventure", "animation", "foreign film", "musicals", "western", "marvelous", "awful", "awaiting", "riveting", "uproarious", "powerful", "legendary", "imaginative", "third-rate","glamorous", "Idiotic", "Ironic", "Mediocre visuals", "SRK", "RK", "Rajesh Khana", "90s","80s","DID", "ZEE","DID1", "DID2", "DID3","DID4", "DID5","Indian Idol","Indian Idol1", "Indian Idol2", "Indian Idol3", "Indian Idol4","SS", "SS1", "SS2","SS3","SS4","SS5","SABTV", "SARE GAMA PA","Jodha Akhbar","Bhootu", "Chattan", "Gudgudee", "Sethji", "Shobha Somnath Ki"]
        Movies.find({"skip": userData.skip,"limit": userData.limit},function(err,movieInstances){
            if(!err && movieInstances)
            {
                console.log("results" + movieInstances.length);
                async.each(movieInstances, function(currentInstance, cb){
                        var index =  Math.floor(Math.random() * 76);
                        console.log("current tag is" + genericTags[index]);
                        if(currentInstance.tags != undefined && currentInstance.tags.length > 0)
                        {
                            currentInstance.tags.push(genericTags[index]);
                            currentInstance.tags.push(genericTags[index + 1]);
                            currentInstance.tags.push(genericTags[index + 2]);
                            currentInstance.tags.push(genericTags[index +3]);
                        }
                        else
                        {
                            currentInstance.tags = new Array();
                            currentInstance.tags.push(genericTags[index]);
                            currentInstance.tags.push(genericTags[index + 1]);
                            currentInstance.tags.push(genericTags[index + 2]);
                            currentInstance.tags.push(genericTags[index +3]);
                        }
                        currentInstance.save(function(err,savedInstance){
                            console.log("saved Tags" + savedInstance.tags.length);
                            cb(null,{});
                        });
                },function(err){
                    if(!err)
                    {
                        console.log("all tags updated");
                        callback(null, {});
                    }
                });


            }

        });
    }

    Movies.search = function (tag,limit,skip, callback)
    {
        if(limit == undefined)
        {
            limit = 20;
        }
        Movies.find({"where":{"tags": {inq: [tag]}},"limit" : limit, "skip" : skip}, function(err,results){
            if(!err && results.length > 0)
            {
                if (results.length == 10)
                {
                    Movies.count({"tags":{inq: ["Comedy"]} },function(err,totalResults){
                        var data = new Object();
                        data.movies = results;
                        data.count = results.length;
                        if(!err)
                        {
                            data.count = totalResults;
                        }
                        var response = createResponseObj(200, "Success", data);
                        callback(null,response);
                    });
                }
                else
                {
                    var data = new Object();
                    data.movies = results;
                    data.count = results.length;
                    var response = createResponseObj(200, "Success", data);
                    callback(null,response);
                }
            }
            else
            {
                if(!err)
                {
                    //Send different response
                    var data = {
                        count : 0,
                        movies: []
                    };
                    var response = createResponseObj(200, "No Results available", data);
                    callback(null,response);
                }
                else
                {
                    callback(err, null);
                }

            }

        });
    }


    function createResponseObj(status, message,data)
    {
        var responseObj = new Object();
        responseObj.status = status
        responseObj.message = message;
        responseObj.data = data;
        return responseObj;
    }

    Movies.remoteMethod('addDummyTags',
    {
      http: { verb: 'post', path: '/addDummyTags' },
      description: 'API to create add dummy tags to movies',
      accepts: [{ arg: 'data', type: 'object', http: { source: 'body' } }, { arg: 'res', type: 'object', http: { source: 'res' } }],
      returns: { arg: 'res', root: true, type: 'string', http: { source: 'res' } }
    });

    Movies.remoteMethod('search',
    {
      http: { verb: 'get', path: '/search' },
      description: 'API to search movies on tags',
      accepts: [{arg: 'tag', type: 'string'},{arg: 'limit', type: 'number'},{arg: 'skip', type: 'number'}],
      returns: { arg: 'res', root: true, type: 'string', http: { source: 'res' } }
    });

};
