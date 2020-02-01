const AWS = require('aws-sdk');
const keys = require('../config/keys');
const uuid = require('uuid/v4');
const requireLogin = require('../middlewares/requireLogin');

console.log(keys.accessKeyID, ':::::::::::::', keys.secretAccessKey);
const s3 = new AWS.S3({
    accessKeyId: keys.accessKeyID,
    secretAccessKey: keys.secretAccessKey
});

module.exports = app => {
    app.get('/api/upload', requireLogin, (req, res) => {
        const key = `${req.user.id}/${uuid()}.jpeg`;
        console.log(s3);
        s3.getSignedUrl('putObject', {
                Bucket: 'j-blog-lee',
                ContentType: 'image/jpeg',
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