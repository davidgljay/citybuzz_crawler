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
		Records: [{
			Sns: {
				Message: {
					domain:mocks.domain,
					path:mocks.path,
          whitelist: mocks.whitelist,
          tags:
            {"stuffies":/imaregex/,
        	"taggy":"imastring"}
          
				}
			}
		}]
	}

mocks.urls = [
	"www.stuff.and/things",
	"www.things.and/stuff",
	"www.another.url/forfun"
]

mocks.batch_get_params = {
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

mocks.batch_get_response = {
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

mocks.batch_put_params = {
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

mocks.sns_publish_params = {
  Message: '{"domain":"www.another.url","path":"/forfun"}',
  TopicArn: 'arn:aws:sns:us-east-1:663987893806:citybuzz_urls'
};

mocks.body="Dec 3rd, 2015   FOR IMMEDIATE RELEASE The mayor of funkytown is getting down."

//TODO: Update to reflect actual dynamoDB put params
mocks.dynamo_body_put_params = 
    {
		Item:  {
			path:{S:'www.test.gov/mayor/press_release'},
			title:{S:'I have a title'},
			body:{S:mocks.body},
			crawled_on:null,
			first_date:{S:new Date(2015,11,3)},
			tags:{NS:["mayor","press_release"]}
		},
	    TableName: 'citybuzz_readings',
	    ConditionalExpression:'attribute_not_exists("path")',
	    ReturnConsumedCapacity: 'NONE'
	};

mocks.rds_query_params = "INSERT IGNORE INTO undefined.READINGS (TITLE, BODY, URL, TAGS, SITE_CODE, SITE_NAME, CRAWLED_ON, FIRST_DATE) VALUES ('I have a title', 'Dec 3rd, 2015   FOR IMMEDIATE RELEASE The mayor of funkytown is getting down.','www.test.gov/mayor/press_release', '[\\\"mayor\\\",\\\"press_release\\\"]', 'NYC', 'New York City', '2015-11-04 06:03:13', '2015-12-03 05:00:00);";

mocks.full_sns_test = {
  "Records": [
    {
      "EventVersion": "1.0",
      "EventSubscriptionArn": "arn:aws:sns:EXAMPLE",
      "EventSource": "aws:sns",
      "Sns": {
        "SignatureVersion": "1",
        "Timestamp": "1970-01-01T00:00:00.000Z",
        "Signature": "EXAMPLE",
        "SigningCertUrl": "EXAMPLE",
        "MessageId": "95df01b4-ee98-5cb9-9903-4c221d41eb5e",
        "Message": {
          "domain":"www1.nyc.gov",
          "path":"/office-of-the-mayor",
                    "whitelist": [{"www1.nyc.gov":["/office-of-the-mayor"]}],
                    "tags":
                        {"mayor":"mayor"}
          
        },
        "MessageAttributes": {
          "Test": {
            "Type": "String",
            "Value": "TestString"
          },
          "TestBinary": {
            "Type": "Binary",
            "Value": "TestBinary"
          }
        },
        "Type": "Notification",
        "UnsubscribeUrl": "EXAMPLE",
        "TopicArn": "arn:aws:sns:EXAMPLE",
        "Subject": "TestInvoke"
      }
    }
  ]
}

module.exports = mocks;