var mocks= {};

mocks.page="<html><body><title>Just another page</title><div>This is a mock page with a <a href=\"www.testlink.com/alink/tostuff\">link</a>.</div></body></html>";

mocks.crawler_response = {
		domain:"www.stuff.com",
		urls:["www.url1.com", "www.url2.edu"],
		body:mocks.page
	}

mocks.domain = "www.stuff.com";
mocks.path = "/things";

mocks.whitelist ={
                "www.stuff.and":["/things", "/morestuff"],
                "www.things.and":["/stuff", "/morethings"],
                "www.another.url":["/forfun"]
            };
mocks.event = {
		records: {
			Sns: {
				Message: {
					domain:mocks.domain,
					path:mocks.path,
          whitelist: mocks.whitelist,
          tags: [
            {"stuffies":/imaregex/}
          ]
				}
			}
		}
	}

mocks.urls = [
	"www.stuff.and/things",
	"www.things.and/stuff",
	"www.another.url/forfun"
]

mocks.batchGetParams = {
    RequestItems: {
        citybuzz_urls: {
            Keys: [
                {
                    reading_url: { S: 'www.stuff.and/things' },
                },
                {
                    reading_url: { S: 'www.things.and/stuff' },
                },
                {
                    reading_url: { S: 'www.another.url/forfun' },
                }
            ],
            AttributesToGet: [
                'reading_url'
            ],
            ConsistentRead: true
        }
    },
    ReturnConsumedCapacity: 'NONE'
}

mocks.batchGetResponse = {
  "Responses": {
    "citybuzz_urls": [
      {
        "reading_url": {
          "S": "www.stuff.and/things"
        }
	  },
	  {
        "reading_url": {
          "S": "www.things.and/stuff"
        }
      }
    ]
  },
  "UnprocessedKeys": {}
}

mocks.batchPutParams = {
    RequestItems:{
       citybuzz_urls:[ 
           {
           PutRequest:{
               Item: {
                    reading_url: { 
                      S: 'www.another.url/forfun'
                    }
               }
              }
           }
        ]
    },
    ReturnConsumedCapacity: 'NONE',
    ReturnItemCollectionMetrics: 'NONE'
};

mocks.snsPublishParams = {
  Message: '{"domain":"www.another.url","path":"/forfun"}',
  TopicArn: 'arn:aws:sns:us-east-1:663987893806:citybuzz_urls'
};

module.exports = mocks;