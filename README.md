# Secure Credentials Node Module

## Background
In almost every project, it's necessary to use credentials to access various resources (databases, APIs, etc.). The recommended way of loading these credentials in Node is through environment variables. However, the credentials still need to be hard-coded somewhere. On AWS, it is possible to create an S3 bucket that is very heavily restricted through access controls and IAM roles. This module allows for the dynamic loading of credentials from a file stored in such a bucket into environment variables accessible to the current process. If a machine hosting the code is compromised, its access can be revoked via IAM, thus never exposing the credentials for the running code.

## Requirements
To use the module:

```javascript
npm install secure-credentials
```

```
var sc = require('secure-credentials');
var config = {
	'AWS_REGION':'us-east-1',						// Required
	'AWS_ACCESS_KEY_ID':'accesskey',
	'AWS_SECRET_ACCESS_KEY':'secret',
	'BUCKET':'bucket.company.com/somebucket',		// Required
	'KEY':'test.config'								// Required
};

sc.download(config, function(err) {
	if (err) {
		// Handle error
	} else {
		// Start web server, make connections, etc.
	}
});
```

Additionally, be sure that the file, test.config, is hosted in the S3 bucket and is structured as:

```
VARIABLE=value
NEXTVARIABLE=nextvalue
```

With no spaces, commas, or extra characters.

## IAM Roles
AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY are provided as part of the config object for testing only. Hard-coding them in a production environment entirely defeats the purpose of this module. Instead, run the module from a machine that is part of an IAM role. The AWS SDK will automatically retrieve the temporary credentials securely and they will never be stored locally.

## An Asynchronous Note
Because of Node.js's nature, this module cannot be used synchronously when making connections to a database, API, etc. The callback must be utilized so that the connection information is fully downloaded and loaded into the environment variable before the connections are attempted. When used with a webserver or framework such as Express, the module must be called first, then, in the callback, app.listen() can be called.

