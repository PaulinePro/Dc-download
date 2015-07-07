var request = require('request');
var fs = require('fs');
var path = require('path');
var redis = require('redis');
var client = redis.createClient();
var cluster = require('cluster');

var downloadImgur = function() {
	client.spop('imgur', function(err, image) {
		if (!image) {
			return;
		}

		image = JSON.parse(image);
		var fileName = path.basename(image.pic);
		var imagePath = 'image' + (image.gender === 'M' ? "gay" : "girl") + "/" + fileName;

		request
			.get(image.pic)
			.on('error', function(err) {
				console.error('download', image.pic, err);
			})
			.on('end', function(err) {
				console.log(fileName + " complete.");
			})
			.pipe(fs.createWriteStream(imagePath));
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
	setInterval(downloadImgur, 200);
}