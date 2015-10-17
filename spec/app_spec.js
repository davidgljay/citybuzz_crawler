var app = require('../app.js'),
Deferred = require('promised-io').Deferred,
mocks=require("./mocks");

describe("App", function() {
	var get_path, get_domain, urls_deduped, messages_posted;
	beforeEach(function() {
		app.crawler.get =  function(d, p) {
				var deferred = new Deferred();
				get_path = p;
				get_domain = d;
				deferred.resolve(mocks.crawler_response);
				return deferred.promise;
			}
		app.process_urls.dedupe_urls = function(urls) {
			var deferred = new Deferred();
			urls_deduped=true;
			deferred.resolve(urls);
			return deferred.promise;
		};
		app.process_urls.publish_urls = function(urls) {
			var deferred = new Deferred();
			urls_posted=true;
		}
	});

	it("should receive an event", function() {
		app.handler(mocks.event);
		expect(app.message).toBeTruthy;
	});

	it ("should fetch the url in the message", function() {
		app.handler(mocks.event);
		expect(get_domain).toBe("www.stuff.com");
		expect(get_path).toBe("/things");
	})

	it ("should dedupe URLs after receiving them", function() {
		app.handler(mocks.event);
		expect(urls_deduped).toBeTruthy;
	});

	it ("should post new URLs after deduping them", function() {
		app.handler(mocks.event);
		expect(urls_deduped).toBeTruthy;
	});
});