var Crawl = require('./crawl'),
dedupe = require('./dedupe'),
logger=require('./logger.js');
count=0;

var crawler = this.crawler = new Crawl();
this.dedupe = dedupe;

module.exports.handler = function(event, context) {
	var self=this;
	var message= this.message = event.records.Sns.Message;
	crawler.get(message)
	.then(dedupe.dedupe_urls, logger.reportError('get'))
	.then(sns.publish_urls, logger.reportError('dedupe'))
	.then(function() {
		context.succeed();
	}, function(err) {
		context.fail(err);
	});
};

