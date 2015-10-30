var process_body = require('../process_body'),
mocks = require('./mocks');

describe("Process_body", function() {
	describe("first date", function() {
		it ("should extract a first date in formal format", function() {
			expect(process_body.get_date(mocks.body)).toEqual(new Date(2015,11,3));
		})

		it ("should extract a first date in verbose format", function() {
			var body = "Stuff will go down on the third of december, 2015."
			expect(process_body.get_date(body)).toEqual(new Date(2015,11,3));
		})

		it ("should extract a first date in numeric format", function() {
			var body="Stuff will go down on 12/03/2015"
			expect(process_body.get_date(body)).toEqual(new Date(2015,11,3));
		})

		it ("should extract a first date in ISO format", function() {
			var body = "Stuff will go down on 2015-12-03"
			expect(process_body.get_date(body)).toEqual(new Date(2015,11,3));
		})

		it ("should return null when there is no date", function() {
			var body ="Stuff will go down, but I don't know when";
			expect(process_body.get_date(body)).toBe(null);
		})
	})

	describe ("get_tags", function() {
		it ("should look for tags based on a regex", function() {
			var tags = {
				"tag":/tag/
			};
			var body = "Should find a tag";

			var result = ["tag"];

			expect(process_body.get_tags(body, tags)).toEqual(result);
		})

		it ("should look for tags based on a string", function() {
			var tags = {
				"tag":"tag"
			};
			var body = "Should find a tag";

			var result = ["tag"];

			expect(process_body.get_tags(body, tags)).toEqual(result);

		})

		it ("should return multiple tag results", function() {
			var tags = {
				"tag":"tag",
				"best":/best/
			};
			var body = "tags are the best";
			var result = [
			"tag","best"];
			expect(process_body.get_tags(body, tags)).toEqual(result);
		})

		it ("should return an empty array when tags aren't present", function() {
			var tags = {
				"tag":"tag"
			}
			var body = "I can't be categorized!!"
			var result = [];
			expect(process_body.get_tags(body,tags)).toEqual(result);
		})
	});


	it ("should return body and tags in the proper format", function() {
		var tags = {
			"mayor":"",
			"press_release":/FOR\sIMMEDIATE\sRELEASE/i
		}

		var result = {
			first_date : new Date(2015,11,3),
			tags : ["mayor","press_release"]
		}
		expect(process_body(mocks.body, tags)).toEqual(result);
	});
})