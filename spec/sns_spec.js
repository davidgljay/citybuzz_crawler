var sns = require('../sns.js'),
mocks = require('./mocks'),
publishCalled = false;

describe("Sns", function() {
	beforeEach(function() {
		publishCalled = false;
		sns.SNS.publish = function(params, callback) {
			publishCalled = true;
			callback(null,'Success');
		};
	});

	it ("should format SNS publish parameters correctly.", function() {
		expect(sns.publishParams('www.another.url','/forfun')).toEqual(mocks.snsPublishParams);
	});

	it ("should call publish.", function(done) {
		sns.publishUrls(mocks.urls, mocks.event.records.Sns.Message).then(function() {
			expect(publishCalled).toBe(true);
			done();
		})
	});
});