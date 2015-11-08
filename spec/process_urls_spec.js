var process_urls,
Deferred = require('promised-io').Deferred,
mocks=require('./mocks');

describe("Process_urls module", function() {
	describe ("process_url function", function() {
		var called_batchGetItem, called_batchWriteItem;

		beforeEach(function() {
			called_batchGetItem=false;
			called_batchWriteItem = false;
			process_urls = require('../process_urls');
			process_urls.dynamodb.batchGetItem = function(params, callback) {
					called_batchGetItem = true;
					callback(null, mocks.batch_get_response);
				};
			process_urls.dynamodb.batchWriteItem = function(params, callback) {
					called_batchWriteItem = true;
					callback(null, mocks.batch_get_response);
				};
		})

		describe ("batchGetItems", function() {

			it("should return parameters formatted for a dynamoDB get request.", function() {
				expect(process_urls.get_params(mocks.urls)).toEqual(mocks.batch_get_params);
			})

			it ("should make a batchGetItems call.", function(done) {
				process_urls.check_url_batch(mocks.urls, mocks.whitelist).then(
					function(result) {
						expect(called_batchGetItem).toBe(true);
						done();
					});
			})	

			it ("should return urls that are not yet present.", function(done) {
				process_urls.check_url_batch(mocks.urls, mocks.whitelist).then(
					function(result) {
						expect(called_batchGetItem).toBe(true);
						expect(result[0]).toBe('www.another.url/forfun');
						done();
					});
			})	
		});

		describe ("batchWriteItems", function() {
			it ("should return parameters formatted for a dynamoDB put request.", function() {
				expect(process_urls.put_params([mocks.urls[2]])).toEqual(mocks.batch_put_params);
			});

			it ("should make a batchWriteItem call", function(done) {
				process_urls.post_url_batch([mocks.urls[2]]).then(
					function(result) {
						expect(called_batchWriteItem).toBe(true);
						done();
					});
			});

			it ("should return urls that are not yet present.", function(done) {
				process_urls.post_url_batch([mocks.urls[2]]).then(
					function(result) {
						expect(called_batchWriteItem).toBe(true);
						expect(result[0]).toBe('www.another.url/forfun');
						done();
					});
			})	
		})

		describe("overall", function() {
			it("should return a list of new urls", function(done) {
				process_urls.process(mocks.urls, mocks.event.records.Sns.Message).then(
					function(result) {
						expect(result[0]).toBe('www.another.url/forfun');
						done();
					})
			})
		})	
	});

	describe("check_urls", function() {
		describe ("should check urls against a whitelist", function() {

			it ("should accept a valid URL", function() {
				expect(process_urls.check_white_list(mocks.urls[1], mocks.event.records.Sns.Message.whitelist)).toBe(true);
			})

			it("should reject an invalid URL", function() {
				expect(process_urls.check_white_list("http://not.a.valid/url", mocks.event.records.Sns.Message.whitelist)).toBe(false);
			})

		})
	})
});

