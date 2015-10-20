var process_urls,
Deferred = require('promised-io').Deferred,
mocks=require('./mocks');

describe("Process_urls module", function() {
	describe ("dedupe_urls function", function() {
		var calledBatchGetItem, calledBatchWriteItem;

		beforeEach(function() {
			calledBatchGetItem=false;
			calledBatchWriteItem = false;
			process_urls = require('../dedupe');
			process_urls.dynamodb.batchGetItem = function(params, callback) {
					calledBatchGetItem = true;
					callback(null, mocks.batchGetResponse);
				};
			process_urls.dynamodb.batchWriteItem = function(params, callback) {
					calledBatchWriteItem = true;
					callback(null, mocks.batchGetResponse);
				};
		})

		describe ("batchGetItems", function() {

			it("should return parameters formatted for a dynamoDB get request.", function() {
				expect(process_urls.getParams(mocks.urls)).toEqual(mocks.batchGetParams);
			})

			it ("should make a batchGetItems call.", function(done) {
				process_urls.checkUrlBatch(mocks.urls).then(
					function(result) {
						expect(calledBatchGetItem).toBe(true);
						done();
					});
			})	

			it ("should return urls that are not yet present.", function(done) {
				process_urls.checkUrlBatch(mocks.urls).then(
					function(result) {
						expect(calledBatchGetItem).toBe(true);
						expect(result[0]).toBe('www.another.url/forfun');
						done();
					});
			})	
		});

		describe ("batchPutItems", function() {
			it ("should return parameters formatted for a dynamoDB put request.", function() {
				expect(process_urls.putParams([mocks.urls[2]])).toEqual(mocks.batchPutParams);
			});

			it ("should make a batchWriteItem call", function(done) {
				process_urls.postUrlBatch([mocks.urls[2]]).then(
					function(result) {
						expect(calledBatchWriteItem).toBe(true);
						done();
					});
			});

			it ("should return urls that are not yet present.", function(done) {
				process_urls.postUrlBatch([mocks.urls[2]]).then(
					function(result) {
						expect(calledBatchWriteItem).toBe(true);
						expect(result[0]).toBe('www.another.url/forfun');
						done();
					});
			})	
		})

		describe("overall", function() {
			it("should return a list of new urls", function(done) {
				process_urls.dedupe_urls(mocks.urls).then(
					function(result) {
						expect(result[0]).toBe('www.another.url/forfun');
						done();
					})
			})
		})	
	})

});

