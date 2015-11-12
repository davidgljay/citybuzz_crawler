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
			var parsedUrls = parse_url(body);
			var cleanedUrls = clean_urls(parsedUrls, domain, path);
			var unfluffed = unfluff(body.toString('utf-8'),'en');
			console.log("Resolving crawler get");
			deferred.resolve(
				{
					domain:domain,
					urls: cleanedUrls,
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

var parse_url = function(body) {
	var re = /<a\s[^>]*href="([^"]*)">/gim;
	var matches,urls = [];
	while (matches=re.exec(body)) {
		urls.push(matches[1]);
	}
	return urls;
};

var clean_urls = function(urls, domain, path) {
	var clean_urls = [];
	//Put URLs into a consistent format.
	for (var i = urls.length - 1; i >= 0; i--) {
		if (urls[i] == '#')
			continue;
		if (urls[i].length > 0 && urls[i][0] == "/")  {
			clean_urls.push(domain + urls[i]);
		} else {
			var re = /[^http:\/\/].+/
			clean_urls.push(re.exec(urls[i])[0])
		}
	};

	//Dedupe the array
	clean_urls.sort();
	var dedupedUrls =[clean_urls[0]];
	for (var i = 1; i<clean_urls.length; i++) {
		if (clean_urls[i] != clean_urls[i-1]) {
			dedupedUrls.push(clean_urls[i]);
		}
	};

	return dedupedUrls;
};

module.exports = Crawl;
