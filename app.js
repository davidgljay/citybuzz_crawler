var Crawl = require('./crawl'),
process_urls = require('./process_urls'),
logger=require('./logger.js');
sns=require('./api/sns.js'),
all = require("promised-io/promise").all,
count=0;

var crawler = this.crawler = new Crawl();
this.process_urls = process_urls;

//TODO: Add separate process for pulling keytag items (ie first date, press release, etc.)
//TODO: Add function for saving to dynamoDB.
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
	return process_urls.process_urls(urls, message)
		.then(sns.publish_urls, logger.reportError('process_urls'))
}

var processAndPostBody = function(title, body, message) {
	
}