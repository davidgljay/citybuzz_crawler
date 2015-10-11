var Crawl = require('./crawl'),
logger = require('./logger');

var crawler = new Crawl();

crawler.get('www.asexuality.org').then(
	function(response) {
		console.log(response);
	},
	function(error) {
		console.log(error);
	});
