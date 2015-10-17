var Crawl = require('./crawl'),
Deferred = require("promised-io").Deferred,
process_urls = require('./process_urls');
count=0;

var crawler = this.crawler = new Crawl();
this.process_urls = process_urls;

module.exports.handler = function(event, context) {
	var self=this;
	var message= this.message = event.records.Sns.Message;
	crawler.get(message.domain, message.path)
	.then(process_urls.dedupe_urls, reportError('get'));
}

// cleanPubSub.subscription.on('message', function(message) {

// 	if (message.data.domain && message.data.path) {
// 		if (count==100) {
// 			count=0;
// 			console.log("Checking:" + message.data.domain + message.data.path);
// 		}
// 		count++;
		
// 		crawler.get(message)
// 		.then(publishUrls, reportError('get'))
// 		.then(ackMessage, reportError('publishUrls'))
// 		.then(function() {
// 		},reportError('ackMessage'));		
// 	} else {
// 		message.ack();
// 	}
// 	//TODO: add saving. Do this through pubsub? There should be a way to run it and publishurls in parellel...

// 	});


// var prepUrls = this.prepurls = function (data) {
// 	var deferred = new Deferred();
// 	var newUrlMessages = this.newUrlMessages = [];
// 	// var deferred = new Deferred();
// 	if (data.urls) {
// 		for (var i = data.urls.length - 1; i >= 0; i--) {
// 			newUrlMessages.push({
// 					domain:data.domain,
// 					path:data.urls[i],
// 					tags:[]
// 			});
// 		};

// 		// rawPubSub.topic.publish(newUrlMessages, function(err, messageIds, apiResponse) {
// 		// 	if (err) {
// 		// 		deferred.reject(err);
// 		// 	} else {
// 		// 		deferred.resolve(data.ackId);
// 		// 	};
// 		};
// 		deferred.resolve(newUrlMessages);

// 		return deferred.promise;
// 	};


// 	return deferred.promise;
// };

// var ackMessage = function(ackId) {
// 	var deferred = new Deferred();
// 	cleanPubSub.subscription.ack(ackId, function(err, response) {
// 		if (err) {
// 			deferred.reject(err);
// 		} else {
// 			deferred.resolve();
// 		}
// 	})
// 	return deferred.promise;
// };

var reportError = function(tag) {
	return function(err) {
		// console.error(tag + ": " + err);		
		console.error(tag + ": " + err);
	};
};

