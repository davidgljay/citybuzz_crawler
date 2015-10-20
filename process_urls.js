var _=require('underscore'),
AWS = require('aws-sdk'),
async = require('async'),
logger = require('./logger.js'),
Deferred = require('promised-io').Deferred;


var dynamodb = this.dynamodb = new AWS.DynamoDB({apiVersion: '2015-02-02'})

module.exports.dedupe_urls = function(urls) {
	var deferred = new Deferred();

	// while(urls.length>0) {
		//Divide urls into batches of 100;
		// var url_batch = urls.slice(0,99);
	checkUrlBatch(urls)
	.then(postNewUrls, logger.reportError('checkUrlBatch'))
	// }
	//Remove the urls that are returned. 
	//Batch put the new URLS, also in batches of 100;
	//Return list of new URLs. Yipes!
	return deferred.promise;
}

module.exports.publish_urls = function() {
	//Pull some shit with dynamoDB

}

var checkUrlBatch = this.checkUrlBatch = function(url_batch) {
	var deferred = new Deferred;
	dynamodb.batchGetItem(getParams(url_batch), function(err, data) {
		if (err) {
			deferred.reject("get in Dedupe error:" + err);
		} else {
			var existingUrls = _.map(data.Responses.citybuzz_urls,function(response) {
				return response.reading_url.S;
			});
			deferred.resolve(_.difference(url_batch, existingUrls));
		}
	});
	return deferred.promise;
};

// var postUrlBatch = this.postUrlBatch = function(url_batch) {
// 	var deferred = new Deferred;
// 	dynamodb.batchGetItem(getParams(url_batch), function(err, data) {
// 		if (err) {
// 			deferred.reject("get in Dedupe error:" + err);
// 		} else {
// 			var existingUrls = _.map(data.Responses.citybuzz_urls,function(response) {
// 			return response.reading_url.S;
// 			});
// 			deferred.resolve(_.difference(url_batch, existingUrls));
// 		}
// 	});
// 	return deferred.promise;
// };

var getParams = this.getParams = function(urls) {
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
	for (var i=0; i<urls.length; i++) {
		params.RequestItems.citybuzz_urls.Keys.push({
			reading_url:{S:urls[i]}
		})
	}
	return params;
}
