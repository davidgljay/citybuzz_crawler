var process_urls,
Deferred = require('promised-io').Deferred,
mocks=require('./mocks');

describe("Process_urls module", function() {
	describe ("dedupe_urls function", function() {
		var calledBatchGetItem;

		beforeEach(function() {
			calledBatchGetItem=false;
			process_urls = require('../process_urls');
			process_urls.dynamodb.batchGetItem = function(params, callback) {
					calledBatchGetItem = true;
					callback(null, mocks.batchGetResponse);
				};
		})

		it("should return parameters formatted for a dynamoDB get request.", function() {
			expect(process_urls.getParams(mocks.urls)).toEqual(mocks.batchGetParams);
		})

		it ("should make a batchGetItems call", function(done) {
			process_urls.checkUrlBatch(mocks.urls).then(
				function(result) {
					expect(calledBatchGetItem).toBe(true);
					done();
				});
		})	

		it ("should return urls that are not yet present", function(done) {
			process_urls.checkUrlBatch(mocks.urls).then(
				function(result) {
					expect(calledBatchGetItem).toBe(true);
					expect(result[0]).toBe('www.another.url/forfun');
					done();
				});
		})			
	})

});

