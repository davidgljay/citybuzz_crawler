
var gcloud = require('gcloud')({
  projectId: 'climatescrape-1019',
  keyFilename: 'climatescrape_key.json'
});

var pubsub = gcloud.pubsub({
	projectId: 'climatescrape-1019'
});

var PubSub = function(topic, subscription) {
	this.topic = pubsub.topic(topic)
	this.subscription = this.topic.subscription(subscription);
};

module.exports = PubSub;

