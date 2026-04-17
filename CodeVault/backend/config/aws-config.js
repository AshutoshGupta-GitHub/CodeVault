//how to connect, with buket,URL etc.

// In this file, we configure the AWS SDK to connect to an S3 bucket.
require("dotenv").config();
const AWS = require("aws-sdk");

AWS.config.update({ region: "ap-south-1" });

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const S3_BUCKET = "sampleapnagithubbucket";

module.exports = { s3, S3_BUCKET };



