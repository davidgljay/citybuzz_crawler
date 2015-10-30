var _=require('underscore'),
AWS = require('aws-sdk'),
async = require('async'),
logger = require('./logger.js'),
Deferred = require('promised-io').Deferred,
all = require("promised-io/promise").all,
_ = require("underscore");


var dynamodb = this.dynamodb = new AWS.DynamoDB({apiVersion: '2015-02-02'})

module.exports.process = function(urls, message) {

	var deferred = new Deferred();
	var promiseArray = [],
	url_copy = urls.slice();


	while(url_copy.length>0) {
		//Divide urls into batches of 100 and check them for diplucates.
		var url_batch = url_copy.splice(0,99);
		promiseArray.push(
			checkUrlBatch(url_batch, message.whitelist)
			.then(postUrlBatch, logger.reportError('checkUrlBatch'))
			.then(function(unique_url_batch) {
				var tinyDeferred = new Deferred();
				deferred.resolve(unique_url_batch);
				return deferred.promise;
			}, logger.reportError('postUrlBatch'))
		);
	};

	//Wait until the batch is 
	all(promiseArray).then(
		function(new_urls) {
			//TODO: handle consistent formatting and make sure to pass on message.
			deferred.resolve(_.flatten(new_urls));
		}, logger.reportError('dedupePromiseArray'))
	return deferred.promise;
}

var checkUrlBatch = this.checkUrlBatch = function(url_batch, whitelist) {
	var deferred = new Deferred;

	//Only keep URLs that match the whitelist condition
	url_batch = _.filter(url_batch, function(url) {
		return checkWhitelist(url, whitelist);
	});

	//Check urls against the DB of urls already being checked.
	dynamodb.batchGetItem(getParams(url_batch), function(err, data) {
		if (err) {
			deferred.reject("Get in Dedupe error:" + err);
		} else {
			var existingUrls = _.map(data.Responses.citybuzz_urls,function(response) {
				return response.reading_url.S;
			});
			deferred.resolve(_.difference(url_batch, existingUrls));
		}
	});
	return deferred.promise;
};

var postUrlBatch = this.postUrlBatch = function(url_batch) {
	var deferred = new Deferred;
	dynamodb.batchWriteItem(putParams(url_batch), function(err, data) {
		if (err) {
			deferred.reject("Post in Dedupe error:" + err);
		} else {
			deferred.resolve(url_batch);
		}
	});
	return deferred.promise;
};

var getParams = this.getParams = function(get_urls) {
	var params = {
    	RequestItems: {
	        citybuzz_urls: {
	            Keys: [],
	            AttributesToGet: [
	                'reading_url'
	            ],
	            ConsistentRead: true
	        }
	    },
	    ReturnConsumedCapacity: 'NONE'
	};
	for (var i=0; i<get_urls.length; i++) {
		params.RequestItems.citybuzz_urls.Keys.push({
			reading_url: {
				S:get_urls[i]
			}
		})
	};
	return params;
};

var putParams = this.putParams = function(urls) {
	var params = {
    	RequestItems: {
	        citybuzz_urls: []
	    },
	    ReturnConsumedCapacity: 'NONE',
	    ReturnItemCollectionMetrics: 'NONE'
	};
	for (var i=0; i<urls.length; i++) {
		params.RequestItems.citybuzz_urls.push({
			PutRequest:{
				Item: {
					reading_url:{S:urls[i]}
				}
			}
		})
	}
	return params;
}

/*
* Checks against a whitelist of the form:
* whitelist: [
*	{
*		"domain.com":["/path1","/path2"],
*		"domain2.com":["/path3", "path4"]    
* ]
*/
var checkWhitelist = this.checkWhitelist = function(url, whitelist) {
	var spliturl = /([^http:\/\/][^\/]+)(.+)/.exec(url),
	valid = false;
	for (path in whitelist[spliturl[1]]) {
		if (spliturl[2].match(whitelist[spliturl[1]][path])) {
			valid = true;
		}
	}
	return valid;
};
