var http = require('http'),
PubSub = require('./pubsub');

var url = 'www1.nyc.gov';

// var pubsub = new PubSub('climatescrape-1019','all');

var options = {
    port: 80,
    hostname: url,
    method: 'GET',
    path: '/'
  };

  var req = http.request(options, function(res) {
  	var body='';
  	res.on('data', function(chunk) {
  		body += chunk;
  	});
  	res.on('end', function(data) {
  		parseUrls(body);
  	})
  }, function(err) {
  	console.log(err);
  })
  req.end();

var parseUrls = function(body) {
	var re = /<a\s[^>]*href="([^"]*)">/gim;
	var matches,links = [];
	while (matches=re.exec(body)) {
		links.push(matches[1]);
	}
	console.log(cleanUrls(links));
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