var AWS = require('aws-sdk'),
Deferred = require('promised-io').Deferred,
async = require('async');

var SNS = this.SNS = new AWS.SNS({apiVersion: '2010-03-31'});


module.exports.publish_urls = function(urls,message) {
	//TODO: split url
	var deferred = new Deferred();
	console.log("publishing urls:" + urls);
	async.map(urls, function(url, callback) {
		SNS.publish(publish_params(message.domain, url),
			function(err, response) {
				if (err) {
					console.log("Err in SNS publish:" + err);
					callback(err)
				} else {
					console.log("SNS Post Success:" + JSON.stringify(response));
					callback(null, response);
				};
		});
	}, function(err, results) {
		if (err) {
			deferred.reject(err);
		} else {
			deferred.resolve(results);
		}
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