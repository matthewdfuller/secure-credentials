var AWS = require('aws-sdk');
var s3 = new AWS.S3();

var download = function(config, callback) {
	// Establish the AWS region
	if (!config.AWS_REGION) {
		callback('You must provide an AWS region.');
		return;
	} else {
		AWS.config.region = config.AWS_REGION;
	}

	// If access key and secret are provided, use them. Otherwise, assume IAM role or process env
	if (config.AWS_ACCESS_KEY_ID && config.AWS_SECRET_ACCESS_KEY) {
		process.env['AWS_ACCESS_KEY_ID'] = config.AWS_ACCESS_KEY_ID;
		process.env['AWS_SECRET_ACCESS_KEY'] = config.AWS_SECRET_ACCESS_KEY;
	}

	// Prepare the AWS call
	var params = {Bucket: config.BUCKET, Key: config.KEY};
	s3.getObject(params, function(err, data){
		if (err) {
			callback(err);
			return;
		} else {
			// Loop through the downloaded data and set each as environment variable
			var arr = data.Body.toString().split('\n');

			for (i in arr) {
				if (arr[i].length > 0) {
					var line = arr[i].split('=');
					process.env[line[0]] = line[1];
				}
			}

			// When done, return a success
			callback(null);
		}
	});
};

exports.download = download;