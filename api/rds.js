
var mysql = require("mysql"),
logger = require('../logger.js'),
Deferred = require('promised-io').Deferred;

module.exports = function(reading) {
  var deferred = new Deferred();

  var connectionVars = {
      host     : process.env.SQL_HOST,
      port     : process.env.SQL_PORT,
      user     : process.env.SQL_USER,
      password : process.env.SQL_PWD,
      database : process.env.SQL_DB,
      ssl      : "Amazon RDS"
    };

  self.connection = mysql.createConnection(connectionVars);

  self.connection.connect(function(err) {
    if (err) {
      deferred.reject('SQL Connection Error:' + err);
    }
   
    console.log('SQL connected as id ' + self.connection.threadId);
    self.connection.query(query_params(reading), function(err, rows, fields) {
        if (err) {
          deferred.reject("SQL Post Error:" + err);
        }
        deferred.resolve();
  });
  return deferred.promise;
};

var query_params = module.exports.query_params = function(reading) {
  var self=this;
	return "INSERT IGNORE INTO " + process.env.SQL_DB + ".READINGS (TITLE, BODY, URL, TAGS, SITE_CODE, SITE_NAME, CRAWLED_ON, FIRST_DATE) " + 
	"VALUES (" + mysql.escape(reading.title) + ", " + mysql.escape(reading.body) + "," + mysql.escape(reading.path) + ", " + 
  mysql.escape(JSON.stringify(reading.tags)) + ", " + mysql.escape(reading.site_code) + ", " + mysql.escape(reading.site_name) + ", '" + 
	new Date().toMysqlFormat() + "', '" + (reading.first_date ? reading.first_date.toMysqlFormat():'') + ");";
}

/**
 Functions to package dates as SQL;
 **/
function twoDigits(d) {
    if(0 <= d && d < 10) return "0" + d.toString();
    if(-10 < d && d < 0) return "-0" + (-1*d).toString();
    return d.toString();
}

Date.prototype.toMysqlFormat = function() {
    return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate()) + " " + 
    twoDigits(this.getUTCHours()) + ":" + twoDigits(this.getUTCMinutes()) + ":" + twoDigits(this.getUTCSeconds());
};