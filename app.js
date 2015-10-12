var Crawl = require('./crawl'),
logger = require('./logger'),
PubSub = require('./pubsub'),
Deferred = require("promised-io").Deferred;;

var crawler = new Crawl(),
cleanPubSub = new PubSub('cityscan_url_unique','unique'),
rawPubSub = new PubSub('cityscan_url_raw','raw');

cleanPubSub.subscription.on('message', function(message) {
	console.log("Message:" + message.data);
	if (message.data.domain && message.data.path) {
		crawler.get(message)
		.then(publishUrls, reportError('get'))
		.then(ackMessage, reportError('publishUrls'))
		.then(function() {
			console.log("Completed " + message.data.path);
		},reportError('ackMessage'));		
	} else {
		message.ack();
	}
	//TODO: add saving. Do this through pubsub? There should be a way to run it and publishurls in parellel...

	});


var publishUrls = function (data) {
	var deferred = new Deferred();
	var newUrlMessages = [];
	// var deferred = new Deferred();
	if (data.urls) {
		for (var i = data.urls.length - 1; i >= 0; i--) {
			newUrlMessages.push({
				data: {
					domain:data.domain,
					path:data.urls[i],
					tags:[]
				}
			});
		};

		rawPubSub.topic.publish(newUrlMessages, function(err, messageIds, apiResponse) {
			if (err) {
				deferred.reject(err);
			} else {
				deferred.resolve(data.ackId);
			};
		});
	} else {
		console.log("No urls present");
		deferred.resolve(data.ackId);
	}


	return deferred.promise;
};

var ackMessage = function(ackId) {
	var deferred = new Deferred();
	cleanPubSub.subscription.ack(ackId, function(err, response) {
		if (err) {
			deferred.reject(err);
		} else {
			deferred.resolve();
		}
	})
	return deferred.promise;
};

var reportError = function(tag) {
	return function(err) {
		// logger.error(tag + ": " + err);		
		console.log(tag + ": " + err);
	};
};

