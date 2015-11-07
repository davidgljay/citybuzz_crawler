var rds = require('../api/rds'),
mocks =require('./mocks');

describe("RDS", function() {
	it ("should generate the proper parameters to post to RDS", function() {
		var reading = {
			path : 'www.test.gov/mayor/press_release',
           	title:'I have a title',
           	body:mocks.body,
           	first_date:new Date(2015,11,3),
           	tags:["mayor","press_release"],
           	site_code:'NYC',
           	site_name:'New York City'
           };
        var result = rds.query_params(reading);
        expect(result.substring(0,50)).toEqual(mocks.rds_query_params.substring(0,50));
	});

	it ("should post to RDS", function() {
		
	})
})