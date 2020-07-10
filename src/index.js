const fs = require('fs')
const AWS = require('aws-sdk')
const moment = require('moment')

const { exec } = require("child_process")

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
})

const uploadFile = (fileName) => {

    const Key = `${process.env.MYSQL_HOST}.${process.env.MYSQL_DATABASE}.${moment().format('YYYY-MM-DD_hh.mm.ss')}.sql`

    console.log(`⬆️ pushing copy of database to S3 bucket (${process.env.AWS_BUCKET_NAME})...`)

    // Read content from the file
    const fileContent = fs.readFileSync(fileName);

    // Setting up S3 upload parameters
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key, // File name you want to save as in S3
        Body: fileContent
    };

    // Uploading files to the bucket
    s3.upload(params, function(err, data) {
        if (err) {
            throw err;
        }
        console.log(`✅ backup created successfully!`);
    });
};

console.log('🚀 backup process started.')
console.log('⬇️ downloading a copy of the database...')

exec(`mysqldump -u ${process.env.MYSQL_USER} -p${process.env.MYSQL_PASSWORD} -h ${process.env.MYSQL_HOST} -P ${process.env.MYSQL_PORT} ${process.env.MYSQL_DATABASE} > dump.sql;`, (error, stdout, stderr) => {

    if (error) {
        throw error
    }
    if (stderr) {
        throw stderr
    }    

    uploadFile(__dirname + '/../dump.sql')
});