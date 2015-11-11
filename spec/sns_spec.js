var sns = require('../api/sns.js'),
mocks = require('./mocks'),
publish_called = false;

describe("Sns", function() {
	beforeEach(function() {
		publish_called = false;
		sns.SNS.publish = function(params, callback) {
			publish_called = true;
			callback(null,'Success');
		};
	});

	it ("should format SNS publish parameters correctly.", function() {
		expect(sns.publish_params('www.another.url','/forfun')).toEqual(mocks.sns_publish_params);
	});

	it ("should call publish.", function(done) {
		sns.publish_urls(mocks.urls, mocks.event.Records[0].Sns.Message).then(function() {
			expect(publish_called).toBe(true);
			done();
		})
	});
});