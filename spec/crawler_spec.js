var mocks = require('./mocks'),
nock = require('nock'),
scope;

var Crawler = require('../crawl');

describe("Crawler", function() {
	var crawler;

	beforeEach(function() {
		crawler = new Crawler();
		scope = nock('http://' + mocks.domain)
			.get(mocks.path)
			.reply(200,mocks.page);
	})

	it("should crawl stuff.", function(done) {
		var response = crawler.get(mocks.event.records.Sns.Message);
		response.then(function(res) {
			expect(res.title).toBe('Just another page');
			expect(res.body).toBe('This is a mock page with a  link');
			expect(res.urls[0]).toBe('www.testlink.com/alink/tostuff');
			expect(res.message).toBe(mocks.event.records.Sns.Message);
			done();
		})
	});
})