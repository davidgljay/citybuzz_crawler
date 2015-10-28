var Crawl = require('./crawl'),
process_urls = require('./process_urls'),
logger=require('./logger.js');
sns=require('./sns.js')
count=0;

var crawler = this.crawler = new Crawl();
this.process_urls = process_urls;

//TODO: Add separate process for pulling keytag items (ie first date, press release, etc.)
//TODO: Add function for saving to dynamoDB.
//TODO: Add function for saving to SQL.

module.exports.handler = function(event, context) {
	var self=this;
	var message= this.message = event.records.Sns.Message;
	crawler.get(message)
	.then(process_urls.process_urls, logger.reportError('get'))
	.then(sns.publish_urls, logger.reportError('process_urls'))
	.then(function() {
		context.succeed();
	}, function(err) {
		context.fail(err);
	});
};

