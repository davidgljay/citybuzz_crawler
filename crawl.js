var http = require('http'),
unfluff = require('unfluff'),
PubSub = require('./pubsub'),
Deferred = require('promised-io').Deferred,
logger = require('../logger.js');

var Crawl = function() {
};


Crawl.prototype.get = function(url) {

	var deferred = new Deferred();
	var spliturl=/([^\/]+)(\/{1}.+)/.exec(url);

	this.options = {
	    port: 80,
	    hostname: spliturl[1],
	    method: 'GET',
	    path: spliturl[2]
	  };

	http.request(options, function(res) {
		var body='';
		res.on('data', function(chunk) {
			body += chunk;
		});
		res.on('end', function(data) {
			//TODO: handle PDFs
			deferred.resolve(
				{
					urls: parseUrls(body),
					body: unfluff(body.toString('utf-8'),'en');
				});
		})
	}, function(err) {
		deferred.reject("Error in crawl get: " + err);
	});
	req.end();
	return deferred.promise; 
}

var parseUrls = function(body) {
	var re = /<a\s[^>]*href="([^"]*)">/gim;
	var matches,links = [];
	while (matches=re.exec(body)) {
		links.push(matches[1]);
	}
}

var cleanUrls = function(urls) {
	var cleanUrls = [];
	//Put URLs into a consistent format.
	for (var i = urls.length - 1; i >= 0; i--) {
		if (urls[i][0] != "/") {
			if (urls[i].substr(0,url.length+7)=="http://" + url) {
				cleanUrls.push(urls[i].substr(url.length+7,urls[i].length))
			};
		} else {
			cleanUrls.push(urls[i]);
		}
	};

	//Dedupe the array
	cleanUrls.sort();
	var dedupedUrls =[cleanUrls[0]];
	for (var i = 1; i<cleanUrls.length; i++) {
		if (cleanUrls[i] != cleanUrls[i-1]) {
			dedupedUrls.push(cleanUrls[i]);
		}
	};

	return dedupedUrls;
}