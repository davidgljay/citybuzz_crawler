var AWS = require('aws-sdk'),
Deferred = require('promised-io').Deferred;

var dynamodb = this.dynamodb = new AWS.DynamoDB({apiVersion: '2015-02-02'})

module.exports = function(reading) {
	var deferred=new Deferred();
	console.log("Preparing to post reading to dynamo");
	//TODO: Test dynamoDB push to this db, verify that it's happening
	//TODO: Set up RDS.
	dynamodb.putItem(put_params(reading), function(err, response) {
		if (err) {
			console.log("Error posting reading to dynamo");
			deferred.reject(err);
		} else {
			console.log("Reading post to dynamo successful");
			deferred.resolve();
		}
	});
	return deferred.promise;
}

var put_params = module.exports.put_params = function(reading) {
	return {
           Item:  {
           	path:{S:reading.path},
           	title:{S:reading.title},
           	body:{S:reading.body},
           	crawled_on:{S:new Date().toString()},
           	first_date:{S:reading.first_date},
           	tags:{SS:reading.tags}
          }
	    ,
	    TableName: 'citybuzz_readings',
	    ReturnConsumedCapacity: 'NONE'
	};
};