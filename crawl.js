var http = require('http'),
unfluff = require('unfluff'),
Deferred = require('promised-io').Deferred;

var Crawl = function() {
	this.http = http;
};

Crawl.prototype.get = function(message) {

	var deferred = new Deferred(),
	domain = message.domain,
	path = message.path;

	if (message == null || message.domain == undefined || message.path == undefined) {
		deferred.reject("Not a valid domain:" + domain +" or path:" + path);
	};
	// var spliturl=/([^\/]+)(\/{1}.+)/.exec(url);



	var options = {
	    port: 80,
	    hostname: domain,
	    method: 'GET',
	    path: path
	  };

	http.request(options, function(res) {
		var body='';
		res.on('data', function(chunk) {
			body += chunk;
		});
		res.on('end', function() {
			//TODO: handle PDFs
			var parsedUrls = parseUrls(body);
			var cleanedUrls = cleanUrls(parsedUrls, domain, path);
			var unfluffed = unfluff(body.toString('utf-8'),'en');
			deferred.resolve(
				{
					domain:domain,
					urls: parseUrls(body),
					title: unfluffed.title,
					body: unfluffed.text,
					message:message
				});
		})
	}, function(err) {
		deferred.reject(err);
	}).end();

	return deferred.promise; 
}

var parseUrls = function(body) {
	var re = /<a\s[^>]*href="([^"]*)">/gim;
	var matches,urls = [];
	while (matches=re.exec(body)) {
		urls.push(matches[1]);
	}
	return urls;
};

var cleanUrls = function(urls, domain, path) {
	var cleanUrls = [];
	//Put URLs into a consistent format.
	for (var i = urls.length - 1; i >= 0; i--) {
		if (urls[i][0] != "/") {
			if (urls[i].substr(0,domain.length+7)=="http://" + domain) {
				cleanUrls.push(urls[i].substr(domain.length+7,urls[i].length))
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
};

module.exports = Crawl;
