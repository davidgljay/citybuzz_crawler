var mocks= {};

mocks.page="<html><body><title>Just another page</title><div>This is a mock page with a <a href=\"www.testlink.com/alink/tostuff\">link</a>.</div></body></html>";

mocks.crawler_response = {
		domain:"www.stuff.com",
		urls:["www.url1.com", "www.url2.edu"],
		body:mocks.page
	}

mocks.domain = "www.stuff.com";
mocks.path = "/things";

mocks.event = {
		records: {
			Sns: {
				Message: {
					domain:mocks.domain,
					path:mocks.path
				}
			}
		}
	}


module.exports = mocks;