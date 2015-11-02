describe("RDS", function() {
	it ("should generate the proper parameters to post to RDS", function() {
		var reading = {
			path : 'www.test.gov/mayor/press_release',
           	title:'I have a title',
           	body:mocks.body,
           	first_date:new Date(2015,11,3),
           	tags:["mayor","press_release"]
           };
        var result = rds.query_params(reading);
        expect(result).toEqual(mocks.dynamo_body_put_params);
        expect(result.Item.crawled_on).toEqual(mocks.dynamo_body_put_params.Item.crawled_on);
        expect(result.Item.first_date).toEqual(mocks.dynamo_body_put_params.Item.first_date);
	});

	it ("should post to RDS", function() {
		
	})
})