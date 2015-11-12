var AWS = require('aws-sdk'),
logger = require('../logger'),
Deferred = require('promised-io').Deferred;

var dynamodb = this.dynamodb = new AWS.DynamoDB({apiVersion: '2015-02-02'})

module.exports = function(reading) {
	var deferred=new Deferred();
	dynamodb.putItem(put_params(reading)), function(err, response) {
		if (err) {
			deferred.reject(err);
		} else {
			deferred.resolve();
		}
	};
	return deferred.promise;
}

var put_params = module.exports.put_params = function(reading) {
	return {
           Item:  {
           	path:{S:reading.path},
           	title:{S:reading.title},
           	body:{S:reading.body},
           	crawled_on:{S:new Date()},
           	first_date:{S:reading.first_date},
           	tags:{NS:reading.tags}
          }
	    ,
	    TableName: 'citybuzz_readings',
	    ConditionalExpression:'attribute_not_exists("path")',
	    ReturnConsumedCapacity: 'NONE'
	};
};