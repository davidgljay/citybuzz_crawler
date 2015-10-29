var AWS = require('aws-sdk'),
Deferred = require('promised-io').Deferred,
all = require("promised-io/promise").all;

var SNS = this.SNS = new AWS.SNS({apiVersion: '2010-03-31'});

module.exports.publishUrls = function(urls,message) {
	//TODO: split url
	var deferred = new Deferred(),
	promiseArray = [];
	for (var i=0; i<urls.length; i++) {
		var publishDeferred = new Deferred();
		SNS.publish(publishParams(message.domain, urls[i]),
			function(err, response) {
				if (err) {
					publishDeferred.reject(err);
				} else {
					publishDeferred.resolve(response);
				};
		});
		promiseArray.push(publishDeferred);
	};
	all(promiseArray).then(
		function(response) {
			deferred.resolve(response)
		}, function(err) {
			deferred.reject("SNS Publish:" + err);
		});
	return deferred.promise;
} 

var publishParams = this.publishParams = function(domain, path) {
	var message = {
		domain: domain,
		path:path
	}
	return {
		Message: JSON.stringify(message),
		TopicArn: 'arn:aws:sns:us-east-1:663987893806:citybuzz_urls'
	};
};