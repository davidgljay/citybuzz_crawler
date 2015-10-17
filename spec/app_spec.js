var app = require('../app.js'),
Deferred = require('promised-io').Deferred,
mocks=require("./mocks");

describe("App", function() {
	var get_message, 
	urls_deduped, 
	messages_published;
	beforeEach(function() {
		app.crawler.get =  function(message) {
				var deferred = new Deferred();
				get_message = message;
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
			messages_published=true;
		}
		messages_published = false;
		urls_deduped = false;
	});

	it("should receive an event", function() {
		app.handler(mocks.event);
		expect(app.message).toBeTruthy;
	});

	it ("should fetch the url in the message", function() {
		app.handler(mocks.event);
		expect(get_message).toBe(mocks.event.records.Sns.Message);
	})

	it ("should dedupe URLs after receiving them", function() {
		app.handler(mocks.event);
		expect(urls_deduped).toBe(true);
	});

	it ("should post new URLs after deduping them", function() {
		app.handler(mocks.event);
		expect(messages_published).toBe(true);
	});
});