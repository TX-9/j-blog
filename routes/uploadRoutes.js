const AWS = require('aws-sdk');
const keys = require('../config/keys');
const uuid = require('uuid/v1');
const requireLogin = require('../middlewares/requireLogin');

console.log(keys.accessKeyID, ':::::::::::::', keys.secretAccessKey);
const s3 = new AWS.S3({
    accessKeyId: keys.accessKeyID,
    secretAccessKey: keys.secretAccessKey,
    signatureVersion: 'v4',
    region: 'ca-central-1'
});

module.exports = app => {
    app.get('/api/upload', requireLogin, (req, res) => {
        const key = `${req.user.id}/${uuid()}.jpeg`;
        console.log(s3);
        s3.getSignedUrl('putObject', {
                Bucket: 'j-blog-lee',
                ContentType: 'image/*',
                Key: key
            },
            (err, url) =>
            {
                console.log(err, url)
                return res.send({key, url});
            }
        );
    });
};