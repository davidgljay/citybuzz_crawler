var Crawl = require('./crawl'),
process_urls = require('./process_urls'),
process_body = require('./process_body'),
dynamo = require('./api/dynamo'),
// rds = require('./api/rds')
logger=require('./logger.js');
sns=require('./api/sns.js'),
all = require("promised-io/promise").all,
count=0;

var crawler = this.crawler = new Crawl();
this.process_urls = process_urls;


//TODO: Add function for saving to SQL.
//TODO: Remove camelCase

module.exports.handler = function(event, context) {
	var self=this;
	var message= this.message = event.records.Sns.Message;
	crawler.get(message)
	.then(function(crawl) {
		all([
				processAndPostUrls(crawl.urls, crawl.message)
			], logger.reportError('url and body processing'))
	}, logger.reportError('crawl'))
	.then(function() {
		context.succeed();
	}, function(err) {
		context.fail(err);
	});
};

var processAndPostUrls = function(urls, message) {
	return process_urls.process(urls, message)
		.then(sns.publish_urls, logger.reportError('process_urls'))
}

var processAndPostBody = function(title, body, message) {
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