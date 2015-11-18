
var mysql = require("mysql"),
logger = require('../logger.js'),
Deferred = require('promised-io').Deferred;

//TODO: handle SQL with a separate function, creating all of these connections is expensive.

module.exports = function(reading) {
  var deferred = new Deferred(),
  self=this;

  var connection_vars = {
      host     : process.env.SQL_HOST,
      port     : process.env.SQL_PORT,
      user     : process.env.SQL_USER,
      password : process.env.SQL_PWD,
      database : process.env.SQL_DB,
      ssl      : "Amazon RDS"
    };

  self.connection = mysql.createConnection(connection_vars);

  console.log("Connecting to SQL: " + JSON.stringify(connection_vars));
  self.connection.connect(function(err) {
    if (err) {
      deferred.reject('SQL Connection Error:' + err);
      return;
    }
   
    console.log('SQL connected as id ' + self.connection.threadId);
    console.log("Posting:" + query_params(reading));
    self.connection.query(query_params(reading), function(err, rows, fields) {
        if (err) {
          deferred.reject("SQL Post Error:" + err);
        } else {
          console.log("SQL Post successful!");
          deferred.resolve();
        }
    });
  });
  return deferred.promise;
};

var query_params = module.exports.query_params = function(reading) {
  var self=this;
	return "INSERT IGNORE INTO " + process.env.SQL_DB + ".READINGS (TITLE, BODY, URL, TAGS, SITE_CODE, SITE_NAME, CRAWLED_ON, FIRST_DATE) " + 
	"VALUES (" + mysql.escape(reading.title) + ", " + mysql.escape(reading.body) + "," + mysql.escape(reading.path) + ", " + 
  mysql.escape(JSON.stringify(reading.tags)) + ", " + mysql.escape(reading.site_code) + ", " + mysql.escape(reading.site_name) + ", '" + 
	new Date().to_msql_format() + "', " + (reading.first_date ? "'" + reading.first_date.to_msql_format() + "'":'NULL') + ");";
}

/**
 Functions to package dates as SQL;
 **/
function two_digits(d) {
    if(0 <= d && d < 10) return "0" + d.toString();
    if(-10 < d && d < 0) return "-0" + (-1*d).toString();
    return d.toString();
}

Date.prototype.to_msql_format = function() {
    return this.getUTCFullYear() + "-" + two_digits(1 + this.getUTCMonth()) + "-" + two_digits(this.getUTCDate()) + " " + 
    two_digits(this.getUTCHours()) + ":" + two_digits(this.getUTCMinutes()) + ":" + two_digits(this.getUTCSeconds());
};