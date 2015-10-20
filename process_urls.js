var _=require('underscore'),
AWS = require('aws_sdk'),
Deferred = require('promised-io').Deferred;


var dynamodb = new AWS.DynamoDB({apiVersion: '2015-02-02'})

var dedupe_urls = module.exports.dedupe_urls = function(urls) {
	var deferred = new Deferred();

	while(urls.length>0) {
		//Divide urls into batches of 100;
		var url_batch = urls.slice(0,99);
		batch.getItem(getParams(url_batch), function(err, data) {

		});
	}
	//Call batch.getItem in an async task;
	//Remove the urls that are returned. 
	//Batch put the new URLS, also in batches of 100;
	//Return list of new URLs. Yipes!
	dynamodb.getItem()
}

var publish_urls = module.exports.publish_urls = function() {
	//Pull some shit with dynamoDB

}

var getParams = module.exports.getParams = function(urls) {
	
}
