var request = require('request');
var redis = require('redis');
var client = redis.createClient();
var _ = require('lodash');

var searchapi = 'https://www.dcard.tw/api/search?search=%E5%9C%96&size=20&forum_alias=sex';

var getPostID = function(from) {
	request.get(searchapi + '&from=' + from, {
		json: true
	}, function(err, res, body) {
		if (!body.length) {
			return;
		}

		var ids = _.pluck(body, 'id');
		ids.forEach(console.log);
		client.sadd('postids', ids);

		getPostID(from + 20);
	});
};
getPostID(0);