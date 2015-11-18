var Crawl = require('./crawl'),
process_urls = require('./process_urls'),
process_body = require('./process_body'),
dynamo = require('./api/dynamo'),
rds = require('./api/rds'),
logger=require('./logger.js');
sns=require('./api/sns'),
all = require("promised-io/promise").all,
count=0;

var crawler = this.crawler = new Crawl();
this.process_urls = process_urls;

module.exports.handler = function(event, context) {
	var self=this;
	var message= this.message = event.Records[0].Sns.Message;
	crawler.get(message)
	.then(function(crawl) {
		console.log( "After crawler get:" + crawl);
		return all([
				process_and_post_urls(crawl.urls, crawl.message),
				process_and_post_body(crawl.title, crawl.body, crawl.message)
			], logger.reportError('url and body processing'))
	}, logger.reportError('crawl'))
	.then(function() {
		console.log("Handler success");
		context.succeed();
	}, function(err) {
		context.fail(err);
	});
};

var process_and_post_urls = function(urls, message) {
	console.log("Processing and posting urls");
	return process_urls.process(urls, message)
		.then(
			function(urls) {
				console.log("About to publish urls:" + urls);
				return sns.publish_urls(urls,message);
			}, logger.reportError('process_urls'))
}

var process_and_post_body = function(title, body, message) {
	var metadata = process_body(body, message.tags);
	var reading = {
		path: message.domain + message.path,
		title:title,
		body: body,
		crawled_on: new Date(),
		first_date: metadata.first_date,
		tags: metadata.tags

	}
	return all([
			dynamo(reading)
			// rds(reading)
		])
}