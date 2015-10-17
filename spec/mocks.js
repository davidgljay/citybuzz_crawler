var mocks= {};

mocks.page="This is a mock page with a <a href='www.testlink.com/alink/tostuff'>link</a>.";
mocks.crawler_response = {
		domain:"www.stuff.com",
		urls:["www.url1.com", "www.url2.edu"],
		body:mocks.page
	}
mocks.event = {
		records: {
			Sns: {
				Message: {
					domain:"www.stuff.com",
					path:"/things"
				}
			}
		}
	}

module.exports = mocks;