'use strict';


var tagAnalytics = function(Taganalytics) {


};

var handleTagAnalytics = function(data)
    {
        var app = require('../server');
        var tagAnalyticsModel = app.models.tagAnalytics;
        tagAnalyticsModel.create(data, function(err,savedTagEvent){
            if(err)
            {
                //Save This in other table for later resync
            }
        });

    }

    module.exports = {tagAnalytics, handleTagAnalytics}
