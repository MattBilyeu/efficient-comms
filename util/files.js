const AWS = require('aws-sdk');
const AWSKey = require('./protected').AWSAccessKey;
const AWSSecret = require('./protected').AWSSecretAccessKey;

exports.deleteFiles = (arr) => {
    const s3 = new AWS.S3({
        accessKeyId: AWSKey,
        secretAccessKey: AWSSecret,
        region: 'us-east-2'
    });

    arr.forEach(url => {
        const fileKey = url.substring(url.lastIndexOf('/') + 1);
        const params = {
            Bucket: 'efficient-comms',
            Key: fileKey
        };
        s3.deleteObject(params, (err, data) => {
            if (err) {
                console.log('Error deleting file: ', err);
            }
        })
    })
}