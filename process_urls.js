var _=require('underscore'),
AWS = require('aws-sdk'),
async = require('async'),
logger = require('./logger.js'),
Deferred = require('promised-io').Deferred,
all = require("promised-io/promise").all,
_ = require("underscore");


var dynamodb = this.dynamodb = new AWS.DynamoDB({apiVersion: '2015-02-02'});

module.exports.process = function(urls, message) {

	var deferred = new Deferred();
	var promiseArray = [],
	url_copy = urls.slice();

	while(url_copy.length>0) {
		//Divide urls into batches of 100 and check them for diplucates.
		var url_batch = url_copy.splice(0,99);
		promiseArray.push(
			check_url_batch(url_batch, message.whitelist)
			.then(post_url_batch, logger.reportError('check_url_batch'))
			.then(function(unique_url_batch) {
				console.log("Posted URL batch:" + unique_url_batch);
				var tinyDeferred = new Deferred();
				tinyDeferred.resolve(unique_url_batch);
				return tinyDeferred.promise;
			}, logger.reportError('post_url_batch'))
		);
	};

	//Wait until the batch is 
	all(promiseArray).then(
		function(new_urls) {
			deferred.resolve(_.flatten(new_urls));
		}, logger.reportError('dedupe_promise_array'))
	return deferred.promise;
}

var check_url_batch = this.check_url_batch = function(url_batch, whitelist) {
	var deferred = new Deferred;
	//Only keep URLs that match the whitelist condition
	url_batch = _.filter(url_batch, function(url) {
		return check_white_list(url, whitelist);
	});
	console.log("checking url batch:" + url_batch);

	if (url_batch.length > 0) {
		console.log("posting to dynamodb:" + JSON.stringify(get_params(url_batch)));
		//Check urls against the DB of urls already being checked.
		dynamodb.batchGetItem(get_params(url_batch), function(err, data) {
			console.log("DynamoDB response!")
			if (err) {
				console.log("Error posting to dynamodb:" + err);
				deferred.reject("Get in Dedupe error:" + err);
			} else {
				console.log("Done checking urls:" + JSON.stringify(data.Responses));

				var existingUrls = _.map(data.Responses.citybuzz_urls,function(response) {
					return response.reading_url.S;
				});
				deferred.resolve(_.difference(url_batch, existingUrls));
			}
		});		
	} else {
		deferred.resolve([]);
	}

	return deferred.promise;
};

var post_url_batch = this.post_url_batch = function(url_batch) {
	var deferred = new Deferred;
	console.log("Posting url batch:" + url_batch);
	if (url_batch.length > 0) {
		dynamodb.batchWriteItem(put_params(url_batch), function(err, data) {
			if (err) {
				deferred.reject("Post in Dedupe error:" + err);
			} else {
				console.log("Url batch post successful.");
				deferred.resolve(url_batch);
			}
		});	
	} else {
		deferred.resolve([]);
	}
	return deferred.promise;
};

var get_params = this.get_params = function(get_urls) {
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

var put_params = this.put_params = function(urls) {
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
var check_white_list = this.check_white_list = function(url, whitelist) {
	var spliturl = /([^http(s)?:\/\/][^\/]+)(.+)/.exec(url),
	valid = false;

	for (path in whitelist[spliturl[1]]) {
		if (spliturl[2].match(whitelist[spliturl[1]][path])) {
			valid = true;
		}
	}
	return valid;
};
