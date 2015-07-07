var request = require('request');
var redis = require('redis');
var client = redis.createClient();
var cluster = require('cluster');

var postq = 'https://www.dcard.tw/api/post/';

var getPostImgur = function() {
	client.spop('postids', function(err, id) {
		if (!id) {
			return;
		}

		request.get(postq + id, {
			json: true
		}, function(err, res, body) {
			if (res.statusCode === 404) {
				return;
			}

			var match = body.version[0].content.match(/https?:\/\/i?\.?imgur.com\/([A-Za-z0-9]+)/g);
			if (!match || !match.length) {
				return;
			}

			match.forEach(function(pic) {
				var newpic = "http://i.imgur.com/" + pic.match(/https?:\/\/i?\.?imgur.com\/([A-Za-z0-9]+)/)[1] + '.jpg';

				console.log(id, pic);
				client.sadd('imgur', JSON.stringify({
					pic: pic,
					gender: body.member.gender
				}));
			});
		});
	});
};

if (cluster.isMaster) {
	for (var i = 0; i < 10; i++) {
		cluster.fork();
	}

	cluster.on('exit', function(worker, code, signal) {
		console.log('worker', worker.process.pid, 'died');
	});
} else {
	setInterval(getPostImgur, 100);
}