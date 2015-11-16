var AWS = require('aws-sdk'),
Deferred = require('promised-io').Deferred,
all = require("promised-io/promise").all;

var SNS = this.SNS = new AWS.SNS({apiVersion: '2010-03-31'});


module.exports.publish_urls = function(urls,message) {
	//TODO: split url
	var deferred = new Deferred(),
	promise_array = [];
	console.log("publishing urls:" + urls);
	for (var i=0; i<urls.length; i++) {
		var publish_deferred = new Deferred();
		SNS.publish(publish_params(message.domain, urls[i]),
			function(err, response) {
				if (err) {
					publish_deferred.reject(err);
				} else {
					console.log("SNS posted:" + response);
					publish_deferred.resolve(response);
				};
		});
		promise_array.push(publish_deferred);
	};
	console.log("promise_array length:" + promise_array.length)
	all(promise_array).then(
		function(response) {
			deferred.resolve(response)
		}, function(err) {
			deferred.reject("SNS Publish:" + err);
		});
	return deferred.promise;
} 

var publish_params = this.publish_params = function(domain, path) {
	var message = {
		domain: domain,
		path:path
	}
	return {
		Message: JSON.stringify(message),
		TopicArn: 'arn:aws:sns:us-east-1:663987893806:citybuzz_urls'
	};
};